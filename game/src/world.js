// Twin Lantern Garden — the rules and the state.
// One clear job: what a click means, what the timer does, what a level is
// worth. It knows nothing about canvas or pixels, so the rules can be tested
// without a browser.

import {
  LEVELS,
  LEVEL_TIME,
  WRONG_CLICK_PENALTY,
  HINTS_PER_LEVEL,
  HINT_COST,
  FIND_BASE,
  MAX_COMBO,
  LEVEL_CLEAR_BONUS_PER_SECOND,
  STORAGE_BEST,
} from './config.js';
import { sfxFound, sfxMiss, sfxHint, sfxLevelClear, sfxWin, sfxLose } from './audio.js';

export class World {
  constructor() {
    this.screen = 'title'; // title | play | levelclear | win | lose | paused
    this.levelIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.totalScore = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.timeLeft = LEVEL_TIME;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.wrongMarks = []; // { panel, x, y, until }
    this.hintPulse = null; // { diffId, until }
    this.levelClearAt = 0;
    this.levelBonus = 0;
    this.stars = 0;
    this.best = 0;
    this.message = '';
    this.messageUntil = 0;
    this.now = 0;
    try {
      this.best = Number(window.localStorage.getItem(STORAGE_BEST)) || 0;
    } catch {
      this.best = 0;
    }
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get foundCount() {
    return this.found.size;
  }

  get diffsTotal() {
    return this.level.diffs.length;
  }

  saveBest() {
    if (this.totalScore > this.best) {
      this.best = this.totalScore;
      try {
        window.localStorage.setItem(STORAGE_BEST, String(this.best));
      } catch {
        // Storage unavailable; the best score just lives for this session.
      }
    }
  }

  startGame() {
    this.levelIndex = 0;
    this.totalScore = 0;
    this.startLevel(0);
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.score = 0;
    this.combo = 0;
    this.timeLeft = LEVEL_TIME;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.wrongMarks = [];
    this.hintPulse = null;
    this.screen = 'play';
    this.message = this.level.tagline;
    this.messageUntil = this.now + 2600;
  }

  // A click inside a picture panel. panel is 'left' or 'right'; x/y are
  // panel-local coordinates. Returns 'found' | 'miss' | 'none'.
  clickAt(panel, x, y) {
    if (this.screen !== 'play') return 'none';
    for (const diff of this.level.diffs) {
      if (this.found.has(diff.id)) continue;
      const dx = x - diff.x;
      const dy = y - diff.y;
      if (dx * dx + dy * dy <= diff.r * diff.r) {
        this.found.add(diff.id);
        this.combo = Math.min(this.combo + 1, MAX_COMBO);
        this.bestCombo = Math.max(this.bestCombo, this.combo);
        const points = FIND_BASE * this.combo;
        this.score += points;
        this.totalScore += points;
        this.message = `${diff.name}! +${points}`;
        this.messageUntil = this.now + 1800;
        sfxFound(this.combo);
        if (this.found.size === this.level.diffs.length) this.completeLevel();
        return 'found';
      }
    }
    // A miss: time penalty, combo lost, red X where they clicked.
    this.timeLeft = Math.max(0, this.timeLeft - WRONG_CLICK_PENALTY);
    this.combo = 0;
    this.wrongMarks.push({ panel, x, y, until: this.now + 900 });
    this.message = `Not there — ${WRONG_CLICK_PENALTY}s lost`;
    this.messageUntil = this.now + 1400;
    sfxMiss();
    if (this.timeLeft <= 0) this.lose();
    return 'miss';
  }

  useHint() {
    if (this.screen !== 'play') return false;
    if (this.hintsLeft <= 0) {
      this.message = 'No hints left on this level';
      this.messageUntil = this.now + 1400;
      return false;
    }
    const remaining = this.level.diffs.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return false;
    const diff = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.totalScore = Math.max(0, this.totalScore - HINT_COST);
    this.score = Math.max(0, this.score - HINT_COST);
    this.hintPulse = { diffId: diff.id, until: this.now + 1400 };
    this.message = `Hint: look near “${diff.name}” (−${HINT_COST})`;
    this.messageUntil = this.now + 1600;
    sfxHint();
    return true;
  }

  completeLevel() {
    this.levelBonus = Math.ceil(this.timeLeft) * LEVEL_CLEAR_BONUS_PER_SECOND;
    this.totalScore += this.levelBonus;
    this.score += this.levelBonus;
    this.screen = 'levelclear';
    this.levelClearAt = this.now;
    sfxLevelClear();
  }

  advance() {
    if (this.levelIndex + 1 < LEVELS.length) {
      this.startLevel(this.levelIndex + 1);
    } else {
      this.win();
    }
  }

  win() {
    this.screen = 'win';
    this.stars = this.totalScore >= 6000 ? 3 : this.totalScore >= 4000 ? 2 : 1;
    this.saveBest();
    sfxWin();
  }

  lose() {
    this.screen = 'lose';
    this.saveBest();
    sfxLose();
  }

  pause() {
    if (this.screen === 'play') this.screen = 'paused';
  }

  resume() {
    if (this.screen === 'paused') this.screen = 'play';
  }

  tick(now, dt) {
    this.now = now;
    this.wrongMarks = this.wrongMarks.filter((m) => m.until > now);
    if (this.hintPulse && this.hintPulse.until <= now) this.hintPulse = null;
    if (this.screen === 'play') {
      this.timeLeft -= dt / 1000;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.lose();
      }
    } else if (this.screen === 'levelclear' && now - this.levelClearAt > 2400) {
      this.advance();
    }
  }
}
