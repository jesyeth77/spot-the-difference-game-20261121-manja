// Twin Lantern Garden — staged scenes for screenshots.
// ?shot=start  → the title screen.
// ?shot=play   → level 1 mid-game: 3 differences already found, 62s left.
// ?shot=play2  → level 2 mid-game: 5 differences already found, 41s left.
// ?shot=end    → the win screen, all three levels finished.
// &seed=N picks which differences are pre-found, deterministically, so the
// same URL always stages the same picture. Real play never uses this file's
// staging: without a ?shot= parameter the game starts on the title screen.

import { shuffle, mulberry32 } from './random.js';

export function stageShot(world) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot') || 'start';
  const seed = Number(params.get('seed') || '1');
  const rng = mulberry32(seed * 7919 + 5);

  if (shot === 'play') {
    world.startGame();
    const order = shuffle(world.level.diffs, rng);
    const marked = order.slice(0, 3);
    for (const diff of marked) world.found.add(diff.id);
    world.timeLeft = 62;
    world.score = 320;
    world.totalScore = 320;
    world.combo = 2;
    world.bestCombo = 2;
    world.message = `${marked[marked.length - 1].name}! +200`;
    world.messageUntil = Number.MAX_SAFE_INTEGER;
  } else if (shot === 'play2') {
    world.startGame();
    world.startLevel(1);
    const order = shuffle(world.level.diffs, rng);
    const marked = order.slice(0, 5);
    for (const diff of marked) world.found.add(diff.id);
    world.timeLeft = 41;
    world.score = 1450;
    world.totalScore = 1450;
    world.combo = 3;
    world.bestCombo = 4;
    world.message = `${marked[marked.length - 1].name}! +300`;
    world.messageUntil = Number.MAX_SAFE_INTEGER;
  } else if (shot === 'end') {
    world.startGame();
    world.startLevel(2);
    for (const diff of world.level.diffs) world.found.add(diff.id);
    world.totalScore = 5230;
    world.score = 5230;
    world.bestCombo = 5;
    world.screen = 'win';
    world.stars = 3;
    try {
      if (world.totalScore > world.best) world.best = world.totalScore;
    } catch {
      // No storage in this browser; the win screen still renders.
    }
  }
  // 'start' (and anything unknown) leaves the title screen alone.
}
