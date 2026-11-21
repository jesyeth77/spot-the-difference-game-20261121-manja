// Twin Lantern Garden — everything the player sees.
// One clear job: turn the World's state into pixels. It never changes the
// rules; it only reads them. Panels, HUD, markers and every screen live here.

import {
  CANVAS_W,
  CANVAS_H,
  PANEL,
  LEFT_X,
  RIGHT_X,
  LEVEL_TIME,
} from './config.js';
import { drawScene, drawDifference } from './scenes.js';
import { isMuted } from './audio.js';

// Footer buttons, shared with input.js so clicks land where the art is.
export const BUTTONS = {
  hint: { x: 1010, y: 696, w: 130, h: 48 },
  mute: { x: 1156, y: 696, w: 106, h: 48 },
};

const INK = '#f5ecd7';
const DIM = '#cbbd9a';
const GOLD = '#c9a86a';
const GREEN = '#37d67a';
const RED = '#ff5a5a';
const YELLOW = '#ffe66d';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function text(ctx, str, x, y, font, color, align = 'left') {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function drawPanel(ctx, world, panelX, side, now) {
  const levelIndex = world.levelIndex;
  drawScene(ctx, levelIndex, panelX);
  if (side === 'right') {
    for (const diff of world.level.diffs) drawDifference(ctx, levelIndex, diff.id, panelX);
  }
  // Frame.
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(panelX, PANEL.y, PANEL.w, PANEL.h);
  // Side badge.
  ctx.fillStyle = side === 'left' ? '#3a6ea5' : '#c0392b';
  ctx.beginPath();
  ctx.arc(panelX + 22, PANEL.y + 22, 16, 0, Math.PI * 2);
  ctx.fill();
  text(ctx, side === 'left' ? 'A' : 'B', panelX + 22, PANEL.y + 23, 'bold 18px Georgia, serif', '#fff', 'center');
  // Found markers on both panels.
  for (const diff of world.level.diffs) {
    if (!world.found.has(diff.id)) continue;
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(panelX + diff.x, PANEL.y + diff.y, diff.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(panelX + diff.x - 9, PANEL.y + diff.y);
    ctx.lineTo(panelX + diff.x - 2, PANEL.y + diff.y + 8);
    ctx.lineTo(panelX + diff.x + 11, PANEL.y + diff.y - 8);
    ctx.stroke();
  }
  // Hint pulse on both panels.
  if (world.hintPulse) {
    const diff = world.level.diffs.find((d) => d.id === world.hintPulse.diffId);
    if (diff) {
      const pulse = 0.55 + 0.45 * Math.sin(now / 130);
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = YELLOW;
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.arc(panelX + diff.x, PANEL.y + diff.y, diff.r + 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
  // Wrong-click Xs on this panel.
  for (const mark of world.wrongMarks) {
    if (mark.panel !== side) continue;
    const x = panelX + mark.x;
    const y = PANEL.y + mark.y;
    ctx.strokeStyle = RED;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 11, y - 11);
    ctx.lineTo(x + 11, y + 11);
    ctx.moveTo(x + 11, y - 11);
    ctx.lineTo(x - 11, y + 11);
    ctx.stroke();
  }
}

function drawHeader(ctx, world) {
  ctx.fillStyle = '#1d1730';
  ctx.fillRect(0, 0, CANVAS_W, 88);
  text(ctx, 'TWIN LANTERN GARDEN', 24, 34, 'bold 30px Georgia, serif', INK);
  text(ctx, 'spot the difference', 24, 64, 'italic 16px Georgia, serif', DIM);
  text(
    ctx,
    `Level ${world.levelIndex + 1} of 3 — ${world.level.name}`,
    CANVAS_W / 2,
    34,
    'bold 20px Georgia, serif',
    INK,
    'center',
  );
  const mins = Math.floor(Math.max(0, world.timeLeft) / 60);
  const secs = Math.floor(Math.max(0, world.timeLeft) % 60);
  const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;
  const timeColor = world.timeLeft < 15 && world.screen === 'play' ? RED : INK;
  text(ctx, `⏱ ${timeStr}`, CANVAS_W / 2, 64, 'bold 18px Georgia, serif', timeColor, 'center');
  text(ctx, `SCORE ${world.totalScore}`, CANVAS_W - 24, 34, 'bold 22px Georgia, serif', INK, 'right');
  text(ctx, `BEST ${world.best}`, CANVAS_W - 24, 64, '16px Georgia, serif', DIM, 'right');
  // Timer bar.
  const frac = Math.max(0, world.timeLeft) / LEVEL_TIME;
  ctx.fillStyle = '#332a4d';
  ctx.fillRect(0, 84, CANVAS_W, 6);
  ctx.fillStyle = frac < 0.17 ? RED : '#57b368';
  ctx.fillRect(0, 84, CANVAS_W * frac, 6);
}

function drawFooter(ctx, world, now) {
  ctx.fillStyle = '#1d1730';
  ctx.fillRect(0, 664, CANVAS_W, CANVAS_H - 664);
  text(ctx, `FOUND  ${world.foundCount} / ${world.diffsTotal}`, 24, 700, 'bold 26px Georgia, serif', INK);
  // Combo flame.
  if (world.combo >= 2 && world.screen === 'play') {
    text(ctx, `COMBO ×${world.combo}`, 24, 734, 'bold 18px Georgia, serif', YELLOW);
  } else if (world.screen === 'play') {
    text(ctx, 'Click a difference on either picture', 24, 734, 'italic 16px Georgia, serif', DIM);
  }
  // Message line, centre.
  if (world.message && now < world.messageUntil) {
    text(ctx, world.message, 640, 718, 'italic 19px Georgia, serif', DIM, 'center');
  }
  // Hint button.
  const hint = BUTTONS.hint;
  ctx.fillStyle = world.hintsLeft > 0 ? '#8a6d3b' : '#4a4238';
  roundRect(ctx, hint.x, hint.y, hint.w, hint.h, 10);
  ctx.fill();
  text(ctx, `💡 HINT (${world.hintsLeft})`, hint.x + hint.w / 2, hint.y + hint.h / 2 + 1, 'bold 16px Georgia, serif', '#fff', 'center');
  // Mute button.
  const mute = BUTTONS.mute;
  ctx.fillStyle = '#3a3352';
  roundRect(ctx, mute.x, mute.y, mute.w, mute.h, 10);
  ctx.fill();
  text(ctx, isMuted() ? '🔇 MUTED' : '🔊 SOUND', mute.x + mute.w / 2, mute.y + mute.h / 2 + 1, 'bold 16px Georgia, serif', '#fff', 'center');
}

function overlay(ctx, alpha) {
  ctx.fillStyle = `rgba(12, 9, 24, ${alpha})`;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function centerBox(ctx, y, h) {
  ctx.fillStyle = 'rgba(23, 18, 38, 0.92)';
  roundRect(ctx, 340, y, 600, h, 18);
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawTitle(ctx, world, now) {
  drawScene(ctx, 0, LEFT_X);
  drawScene(ctx, 0, RIGHT_X);
  for (const diff of world.level.diffs) drawDifference(ctx, 0, diff.id, RIGHT_X);
  overlay(ctx, 0.62);
  text(ctx, 'TWIN LANTERN GARDEN', CANVAS_W / 2, 210, 'bold 58px Georgia, serif', INK, 'center');
  text(ctx, 'spot the difference', CANVAS_W / 2, 262, 'italic 26px Georgia, serif', GOLD, 'center');
  text(ctx, 'Two pictures. Seven differences. One sharp pair of eyes.', CANVAS_W / 2, 330, '20px Georgia, serif', INK, 'center');
  text(ctx, 'Click a difference on either picture — a green ring marks it found.', CANVAS_W / 2, 362, '18px Georgia, serif', DIM, 'center');
  text(ctx, 'Wrong clicks cost 5 seconds. Hints cost 50 points. 90 seconds a level.', CANVAS_W / 2, 390, '18px Georgia, serif', DIM, 'center');
  if (world.best > 0) text(ctx, `Best score: ${world.best}`, CANVAS_W / 2, 436, 'bold 20px Georgia, serif', YELLOW, 'center');
  const pulse = 0.6 + 0.4 * Math.sin(now / 260);
  ctx.save();
  ctx.globalAlpha = pulse;
  text(ctx, '— CLICK OR PRESS ENTER TO PLAY —', CANVAS_W / 2, 510, 'bold 24px Georgia, serif', INK, 'center');
  ctx.restore();
}

function drawLevelClear(ctx, world) {
  centerBox(ctx, 300, 190);
  text(ctx, 'LEVEL COMPLETE!', CANVAS_W / 2, 350, 'bold 36px Georgia, serif', GREEN, 'center');
  text(ctx, `${world.level.name} — all ${world.diffsTotal} differences found`, CANVAS_W / 2, 396, '20px Georgia, serif', INK, 'center');
  text(ctx, `Time bonus +${world.levelBonus}  ·  Score ${world.totalScore}`, CANVAS_W / 2, 432, 'bold 20px Georgia, serif', YELLOW, 'center');
  text(ctx, 'Next level coming…', CANVAS_W / 2, 466, 'italic 17px Georgia, serif', DIM, 'center');
}

function drawWin(ctx, world) {
  centerBox(ctx, 250, 300);
  text(ctx, 'YOU FOUND THEM ALL!', CANVAS_W / 2, 310, 'bold 38px Georgia, serif', GREEN, 'center');
  const stars = '★'.repeat(world.stars) + '☆'.repeat(3 - world.stars);
  text(ctx, stars, CANVAS_W / 2, 368, '44px Georgia, serif', YELLOW, 'center');
  text(ctx, `Final score  ${world.totalScore}`, CANVAS_W / 2, 424, 'bold 24px Georgia, serif', INK, 'center');
  text(ctx, `Best combo ×${world.bestCombo}  ·  Best score ${world.best}`, CANVAS_W / 2, 458, '19px Georgia, serif', DIM, 'center');
  text(ctx, 'Press R to play again', CANVAS_W / 2, 506, 'italic 18px Georgia, serif', DIM, 'center');
}

function drawLose(ctx, world) {
  centerBox(ctx, 280, 240);
  text(ctx, 'TIME’S UP!', CANVAS_W / 2, 330, 'bold 38px Georgia, serif', RED, 'center');
  text(ctx, `You found ${world.foundCount} of ${world.diffsTotal} on ${world.level.name}`, CANVAS_W / 2, 382, '20px Georgia, serif', INK, 'center');
  text(ctx, `Score ${world.totalScore}  ·  Best ${world.best}`, CANVAS_W / 2, 418, 'bold 20px Georgia, serif', YELLOW, 'center');
  text(ctx, 'Press R to try again', CANVAS_W / 2, 462, 'italic 18px Georgia, serif', DIM, 'center');
}

function drawPaused(ctx) {
  overlay(ctx, 0.55);
  text(ctx, 'PAUSED', CANVAS_W / 2, 380, 'bold 44px Georgia, serif', INK, 'center');
  text(ctx, 'Press P to continue', CANVAS_W / 2, 432, '20px Georgia, serif', DIM, 'center');
}

export function draw(ctx, world, now) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#171226';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  if (world.screen === 'title') {
    drawTitle(ctx, world, now);
    return;
  }
  drawHeader(ctx, world);
  drawPanel(ctx, world, LEFT_X, 'left', now);
  drawPanel(ctx, world, RIGHT_X, 'right', now);
  drawFooter(ctx, world, now);
  if (world.screen === 'levelclear') drawLevelClear(ctx, world);
  else if (world.screen === 'win') drawWin(ctx, world);
  else if (world.screen === 'lose') drawLose(ctx, world);
  else if (world.screen === 'paused') drawPaused(ctx);
}
