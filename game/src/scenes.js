// Twin Lantern Garden — the pictures themselves.
// Every scene is drawn procedurally on canvas: no images, no assets, no
// network. drawScene paints the base picture identically in both panels;
// drawDifference paints one altered detail onto the RIGHT panel only.
// Positions are panel-local (600 x 560). All sparkle uses a fixed seed, so
// the two panels match exactly except for the differences.

import { PANEL, LEVELS } from './config.js';
import { mulberry32 } from './random.js';

function skyGradient(ctx, level) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL.h);
  g.addColorStop(0, level.skyTop);
  g.addColorStop(1, level.skyBottom);
  return g;
}

function patchSky(ctx, level, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = skyGradient(ctx, level);
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function stars(ctx, rng, count, maxY) {
  ctx.save();
  for (let i = 0; i < count; i += 1) {
    const x = 20 + rng() * (PANEL.w - 40);
    const y = 14 + rng() * maxY;
    const r = 0.8 + rng() * 1.6;
    ctx.globalAlpha = 0.45 + rng() * 0.55;
    ctx.fillStyle = '#fff8d6';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------- level 1
function drawGardenBase(ctx, level) {
  const rng = mulberry32(101);
  ctx.fillStyle = skyGradient(ctx, level);
  ctx.fillRect(0, 0, PANEL.w, PANEL.h);
  stars(ctx, rng, 26, 190);
  // Crescent moon.
  circle(ctx, 92, 74, 26, '#f7ead0');
  circle(ctx, 104, 66, 22, level.skyTop);
  // Hanging branch with three paper lanterns.
  ctx.strokeStyle = '#3a2a1e';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, 34);
  ctx.quadraticCurveTo(300, 52, 600, 30);
  ctx.stroke();
  const lanterns = [150, 300, 450];
  for (const lx of lanterns) {
    ctx.strokeStyle = '#3a2a1e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx, 42);
    ctx.lineTo(lx, 56);
    ctx.stroke();
    ctx.save();
    ctx.shadowColor = '#ffb347';
    ctx.shadowBlur = 22;
    ctx.fillStyle = '#ff8c42';
    ctx.beginPath();
    ctx.roundRect(lx - 18, 56, 36, 44, 12);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#d96a1e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx - 18, 68);
    ctx.lineTo(lx + 18, 68);
    ctx.moveTo(lx - 18, 88);
    ctx.lineTo(lx + 18, 88);
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(lx - 3, 100, 6, 6);
  }
  // Pond.
  ellipse(ctx, 300, 400, 282, 122, '#1e4d5c');
  ctx.strokeStyle = 'rgba(180,230,220,0.35)';
  ctx.lineWidth = 2;
  for (const [rx, ry] of [[220, 380], [330, 420], [260, 440]]) {
    ctx.beginPath();
    ctx.ellipse(rx, ry, 46, 9, 0, 0.15, Math.PI - 0.15);
    ctx.stroke();
  }
  // Koi fish.
  drawKoi(ctx, 205, 392, '#ff7f2a', 1);
  drawKoi(ctx, 385, 432, '#f2ede0', -1);
  // Lily pads + frog.
  ellipse(ctx, 150, 452, 30, 12, '#3e8e4f');
  ellipse(ctx, 300, 482, 26, 11, '#357f45');
  ellipse(ctx, 432, 428, 30, 12, '#3e8e4f');
  drawFrog(ctx, 432, 424);
  // Grassy bank and tulips.
  ctx.fillStyle = '#2f6b3a';
  ctx.fillRect(0, 508, PANEL.w, 52);
  for (const [tx, col] of [[60, '#e84a6f'], [160, '#ffd166'], [260, '#e84a6f'], [360, '#ff8c42'], [460, '#ffd166']]) {
    drawTulip(ctx, tx, 512, col);
  }
  // Fireflies.
  for (let i = 0; i < 8; i += 1) {
    const x = 40 + rng() * 520;
    const y = 120 + rng() * 300;
    ctx.save();
    ctx.shadowColor = '#ffe66d';
    ctx.shadowBlur = 14;
    circle(ctx, x, y, 3, '#ffe66d');
    ctx.restore();
  }
}

function drawKoi(ctx, x, y, color, dir) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  ellipse(ctx, 0, 0, 26, 10, color);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-24, 0);
  ctx.lineTo(-40, -12);
  ctx.lineTo(-40, 12);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 18, -3, 2.4, '#222');
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-2, 0, 8, 0.4, Math.PI - 0.4);
  ctx.stroke();
  ctx.restore();
}

function drawFrog(ctx, x, y) {
  ellipse(ctx, x, y, 16, 11, '#57b368');
  circle(ctx, x - 8, y - 10, 5, '#57b368');
  circle(ctx, x + 8, y - 10, 5, '#57b368');
  circle(ctx, x - 8, y - 11, 2.2, '#1c2b1c');
  circle(ctx, x + 8, y - 11, 2.2, '#1c2b1c');
}

function drawTulip(ctx, x, y, color) {
  ctx.strokeStyle = '#2f6b3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 34);
  ctx.lineTo(x, y + 8);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 9, y + 10);
  ctx.quadraticCurveTo(x - 11, y - 8, x, y - 2);
  ctx.quadraticCurveTo(x + 11, y - 8, x + 9, y + 10);
  ctx.quadraticCurveTo(x, y + 16, x - 9, y + 10);
  ctx.fill();
}

function drawGardenDiff(ctx, level, id) {
  if (id === 'moon') {
    circle(ctx, 92, 74, 26, '#f7ead0');
    ctx.save();
    ctx.shadowColor = '#f7ead0';
    ctx.shadowBlur = 18;
    circle(ctx, 92, 74, 20, '#fdf3d8');
    ctx.restore();
  } else if (id === 'lantern') {
    patchSky(ctx, level, 268, 40, 64, 72);
    ctx.strokeStyle = '#3a2a1e';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(268, 46);
    ctx.quadraticCurveTo(300, 50, 332, 46);
    ctx.stroke();
  } else if (id === 'koi') {
    ellipse(ctx, 205, 392, 30, 13, '#1e4d5c');
    drawKoi(ctx, 205, 392, '#f2ede0', 1);
    circle(ctx, 200, 388, 4, '#c9c2b0');
    circle(ctx, 212, 396, 3, '#c9c2b0');
  } else if (id === 'tulip') {
    drawTulip(ctx, 522, 498, '#9b5de5');
  } else if (id === 'frog') {
    // The frog sits on the pad with its eyes poking above it, so cover the
    // whole frog — eyes included — with pad green, then repaint the pad.
    ellipse(ctx, 432, 424, 32, 17, '#3e8e4f');
    ellipse(ctx, 432, 428, 30, 12, '#3e8e4f');
  } else if (id === 'lotus') {
    ctx.fillStyle = '#f7a8c4';
    for (let i = 0; i < 5; i += 1) {
      const a = -Math.PI / 2 + (i - 2) * 0.5;
      ctx.beginPath();
      ctx.ellipse(152 + Math.cos(a) * 10, 448 + Math.sin(a) * 8, 7, 12, a, 0, Math.PI * 2);
      ctx.fill();
    }
    circle(ctx, 152, 450, 4, '#ffd166');
  } else if (id === 'firefly') {
    ctx.save();
    ctx.shadowColor = '#ffe66d';
    ctx.shadowBlur = 20;
    circle(ctx, 545, 128, 4.5, '#ffe66d');
    ctx.restore();
  }
}

// ---------------------------------------------------------------- level 2
function drawCafeBase(ctx, level) {
  const rng = mulberry32(202);
  // Wall.
  ctx.fillStyle = '#4a2f2a';
  ctx.fillRect(0, 0, PANEL.w, PANEL.h);
  ctx.fillStyle = '#5d3a30';
  ctx.fillRect(0, 380, PANEL.w, 180);
  // Window with night sky and rain.
  ctx.fillStyle = '#2a1a16';
  ctx.fillRect(28, 28, 544, 340);
  ctx.fillStyle = skyGradient(ctx, level);
  ctx.fillRect(40, 40, 520, 316);
  stars(ctx, rng, 18, 200);
  circle(ctx, 480, 90, 22, '#f7ead0');
  circle(ctx, 490, 84, 19, level.skyTop);
  ctx.save();
  ctx.strokeStyle = 'rgba(200,220,255,0.5)';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 26; i += 1) {
    const x = 50 + rng() * 500;
    const y = 50 + rng() * 290;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 6, y + 16);
    ctx.stroke();
  }
  ctx.restore();
  // Window crossbars and sill.
  ctx.fillStyle = '#2a1a16';
  ctx.fillRect(296, 40, 8, 316);
  ctx.fillRect(40, 192, 520, 8);
  ctx.fillStyle = '#6b4a35';
  ctx.fillRect(28, 368, 544, 16);
  // Hanging lamp, lit.
  ctx.strokeStyle = '#1c1210';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 0);
  ctx.lineTo(300, 40);
  ctx.stroke();
  ctx.save();
  ctx.shadowColor = '#ffca6a';
  ctx.shadowBlur = 30;
  circle(ctx, 300, 62, 26, '#ffca6a');
  ctx.restore();
  ctx.fillStyle = '#8a6d3b';
  ctx.beginPath();
  ctx.moveTo(276, 52);
  ctx.lineTo(324, 52);
  ctx.lineTo(312, 30);
  ctx.lineTo(288, 30);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 300, 62, 12, '#fff2c4');
  // Picture frame: a moonlit scene.
  ctx.fillStyle = '#7a5a2e';
  ctx.fillRect(492, 88, 64, 64);
  ctx.fillStyle = '#1d2b4a';
  ctx.fillRect(498, 94, 52, 52);
  circle(ctx, 516, 112, 10, '#f7ead0');
  circle(ctx, 520, 109, 9, '#1d2b4a');
  ctx.fillStyle = '#274b63';
  ctx.beginPath();
  ctx.moveTo(498, 146);
  ctx.lineTo(516, 128);
  ctx.lineTo(534, 146);
  ctx.lineTo(550, 146);
  ctx.closePath();
  ctx.fill();
  // Potted plant.
  ctx.fillStyle = '#b5651d';
  ctx.beginPath();
  ctx.moveTo(72, 356);
  ctx.lineTo(112, 356);
  ctx.lineTo(106, 384);
  ctx.lineTo(78, 384);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3e8e4f';
  for (const [lx, ly, a] of [[80, 330, -0.5], [92, 318, 0], [104, 330, 0.5]]) {
    ctx.beginPath();
    ctx.ellipse(lx, ly, 9, 22, a, 0, Math.PI * 2);
    ctx.fill();
  }
  // Cat asleep on the sill.
  drawCat(ctx, 428, 330, true);
  // Books stack.
  ctx.fillStyle = '#7a2e3a';
  ctx.fillRect(452, 384, 64, 12);
  ctx.fillStyle = '#2e5a7a';
  ctx.fillRect(456, 372, 56, 12);
  ctx.fillStyle = '#7a6a2e';
  ctx.fillRect(460, 360, 48, 12);
  // Table and coffee cups.
  ctx.fillStyle = '#6b4a35';
  ctx.fillRect(0, 396, PANEL.w, 164);
  ctx.fillStyle = '#7d5a40';
  ctx.fillRect(0, 396, PANEL.w, 8);
  drawCup(ctx, 252, 440, '#3a6ea5');
  drawCup(ctx, 368, 442, '#e8dcc8');
}

function drawCat(ctx, x, y, tailUp) {
  // Sleeping cat, curled on the sill.
  ctx.fillStyle = '#e8a04c';
  ellipse(ctx, x, y, 34, 16, '#e8a04c');
  circle(ctx, x - 30, y - 8, 13, '#e8a04c');
  ctx.beginPath();
  ctx.moveTo(x - 40, y - 16);
  ctx.lineTo(x - 36, y - 28);
  ctx.lineTo(x - 30, y - 18);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 28, y - 18);
  ctx.lineTo(x - 24, y - 28);
  ctx.lineTo(x - 20, y - 16);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e8a04c';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (tailUp) {
    ctx.moveTo(x + 32, y + 2);
    ctx.quadraticCurveTo(x + 52, y - 6, x + 46, y - 26);
  } else {
    ctx.moveTo(x + 32, y + 2);
    ctx.quadraticCurveTo(x + 44, y + 12, x + 18, y + 12);
  }
  ctx.stroke();
  ctx.strokeStyle = '#c97f2e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 34, y + 4);
  ctx.lineTo(x - 14, y + 4);
  ctx.moveTo(x - 30, y + 10);
  ctx.lineTo(x - 12, y + 10);
  ctx.stroke();
}

function drawCup(ctx, x, y, color) {
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  for (const ox of [-8, 2]) {
    ctx.beginPath();
    ctx.moveTo(x + ox, y - 22);
    ctx.quadraticCurveTo(x + ox + 6, y - 32, x + ox, y - 42);
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x - 20, y - 20, 40, 30, 6);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x + 22, y - 5, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.fillStyle = '#2a1a16';
  ctx.fillRect(x - 22, y + 12, 46, 4);
}

function drawCafeDiff(ctx, level, id) {
  if (id === 'rain') {
    // The rain stops: repaint this patch of glass with the night sky.
    ctx.save();
    ctx.beginPath();
    ctx.rect(110, 150, 80, 80);
    ctx.clip();
    ctx.fillStyle = skyGradient(ctx, level);
    ctx.fillRect(110, 150, 80, 80);
    ctx.restore();
  } else if (id === 'tail') {
    // The raised tail stands against the window glass, so the cover must be
    // sky, not sill brown — then the cat is repainted with its tail curled.
    patchSky(ctx, level, 438, 284, 46, 52);
    drawCat(ctx, 428, 330, false);
  } else if (id === 'cup') {
    drawCup(ctx, 252, 440, '#c0392b');
  } else if (id === 'books') {
    ctx.fillStyle = '#6b4a35';
    ctx.fillRect(458, 358, 52, 14);
  } else if (id === 'picture') {
    ctx.fillStyle = '#f7b733';
    ctx.fillRect(498, 94, 52, 52);
    circle(ctx, 524, 116, 12, '#ffdf6b');
    ctx.save();
    ctx.shadowColor = '#ffdf6b';
    ctx.shadowBlur = 12;
    circle(ctx, 524, 116, 9, '#fff2a8');
    ctx.restore();
    ctx.fillStyle = '#c96a1e';
    ctx.beginPath();
    ctx.moveTo(498, 146);
    ctx.lineTo(516, 128);
    ctx.lineTo(534, 146);
    ctx.lineTo(550, 146);
    ctx.closePath();
    ctx.fill();
  } else if (id === 'plant') {
    circle(ctx, 92, 312, 7, '#f7a8c4');
    circle(ctx, 92, 312, 3, '#ffd166');
  } else if (id === 'lamp') {
    ctx.fillStyle = '#4a2f2a';
    ctx.beginPath();
    ctx.arc(300, 62, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5a4a3a';
    ctx.beginPath();
    ctx.moveTo(276, 52);
    ctx.lineTo(324, 52);
    ctx.lineTo(312, 30);
    ctx.lineTo(288, 30);
    ctx.closePath();
    ctx.fill();
    circle(ctx, 300, 62, 10, '#3a2f28');
  }
}

// -------------------------------------------------------------- level 3
function drawCampBase(ctx, level) {
  const rng = mulberry32(303);
  ctx.fillStyle = skyGradient(ctx, level);
  ctx.fillRect(0, 0, PANEL.w, PANEL.h);
  stars(ctx, rng, 42, 240);
  // Full moon.
  circle(ctx, 524, 72, 26, '#f7ead0');
  ctx.save();
  ctx.shadowColor = '#f7ead0';
  ctx.shadowBlur = 16;
  circle(ctx, 524, 72, 20, '#fdf3d8');
  ctx.restore();
  // Mountains.
  ctx.fillStyle = '#1a2b45';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.lineTo(120, 240);
  ctx.lineTo(240, 330);
  ctx.lineTo(360, 250);
  ctx.lineTo(480, 330);
  ctx.lineTo(600, 260);
  ctx.lineTo(600, 360);
  ctx.lineTo(0, 360);
  ctx.closePath();
  ctx.fill();
  // Pine trees.
  drawPine(ctx, 92, 320, 1);
  drawPine(ctx, 180, 336, 0.8);
  drawPine(ctx, 520, 318, 1.05);
  // Owl on a branch.
  ctx.strokeStyle = '#3a2a1e';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(470, 122);
  ctx.lineTo(540, 112);
  ctx.stroke();
  drawOwl(ctx, 502, 100);
  // Ground.
  ctx.fillStyle = '#23402a';
  ctx.fillRect(0, 360, PANEL.w, 200);
  ctx.fillStyle = '#2f5233';
  for (let i = 0; i < 12; i += 1) {
    const x = 20 + rng() * 560;
    const y = 520 + rng() * 30;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 4, y - 12);
    ctx.lineTo(x + 8, y);
    ctx.fill();
  }
  // Tent with an open door.
  ctx.fillStyle = '#e8722a';
  ctx.beginPath();
  ctx.moveTo(220, 460);
  ctx.lineTo(300, 350);
  ctx.lineTo(380, 460);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2a1a16';
  ctx.beginPath();
  ctx.moveTo(282, 460);
  ctx.lineTo(300, 400);
  ctx.lineTo(318, 460);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#b85a1e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 350);
  ctx.lineTo(300, 400);
  ctx.stroke();
  // Sleeping bag.
  ctx.fillStyle = '#3a6ea5';
  ctx.beginPath();
  ctx.roundRect(170, 470, 52, 26, 12);
  ctx.fill();
  ctx.fillStyle = '#2e5a7a';
  ctx.fillRect(170, 480, 52, 5);
  // Campfire.
  drawFire(ctx, 300, 496, 1);
  // Marshmallow sticks.
  drawStick(ctx, 400, 470, 452, 452);
  drawStick(ctx, 470, 478, 428, 448);
}

function drawPine(ctx, x, y, s) {
  ctx.fillStyle = '#1e4d2e';
  ctx.beginPath();
  ctx.moveTo(x - 34 * s, y);
  ctx.lineTo(x, y - 78 * s);
  ctx.lineTo(x + 34 * s, y);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 26 * s, y - 34 * s);
  ctx.lineTo(x, y - 100 * s);
  ctx.lineTo(x + 26 * s, y - 34 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a2a1e';
  ctx.fillRect(x - 5 * s, y, 10 * s, 14 * s);
}

function drawOwl(ctx, x, y) {
  ellipse(ctx, x, y, 15, 19, '#7a5a3a');
  circle(ctx, x - 6, y - 10, 6, '#f2ede0');
  circle(ctx, x + 6, y - 10, 6, '#f2ede0');
  circle(ctx, x - 6, y - 10, 2.6, '#1c2b1c');
  circle(ctx, x + 6, y - 10, 2.6, '#1c2b1c');
  ctx.fillStyle = '#e8a04c';
  ctx.beginPath();
  ctx.moveTo(x - 3, y - 4);
  ctx.lineTo(x + 3, y - 4);
  ctx.lineTo(x, y + 1);
  ctx.closePath();
  ctx.fill();
}

function drawFire(ctx, x, y, scale) {
  ctx.fillStyle = '#8a8a8a';
  for (const [sx, sy] of [[-26, 6], [26, 6], [0, 12], [-14, 12], [14, 12]]) {
    circle(ctx, x + sx, y + sy, 7, '#8a8a8a');
  }
  ctx.strokeStyle = '#6b4226';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 22, y + 2);
  ctx.lineTo(x + 22, y - 4);
  ctx.moveTo(x + 22, y + 2);
  ctx.lineTo(x - 22, y - 4);
  ctx.stroke();
  const flame = (fx, fy, s, col) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(fx, fy - 30 * s);
    ctx.quadraticCurveTo(fx + 16 * s, fy - 6 * s, fx, fy + 4 * s);
    ctx.quadraticCurveTo(fx - 16 * s, fy - 6 * s, fx, fy - 30 * s);
    ctx.fill();
  };
  flame(x, y - 2, 1.15 * scale, '#e8722a');
  flame(x, y, 0.8 * scale, '#ffb347');
  flame(x, y + 2, 0.45 * scale, '#ffe66d');
}

function drawStick(ctx, x1, y1, x2, y2) {
  ctx.strokeStyle = '#8a6d3b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.fillStyle = '#f7f3e8';
  ctx.beginPath();
  ctx.roundRect(x2 - 7, y2 - 7, 14, 14, 4);
  ctx.fill();
  ctx.fillStyle = '#d9c9a8';
  ctx.fillRect(x2 - 7, y2 + 1, 14, 3);
}

function drawCampDiff(ctx, level, id) {
  if (id === 'owl') {
    patchSky(ctx, level, 468, 78, 76, 52);
    ctx.strokeStyle = '#3a2a1e';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(470, 122);
    ctx.lineTo(540, 112);
    ctx.stroke();
  } else if (id === 'tent') {
    ctx.fillStyle = '#e8722a';
    ctx.beginPath();
    ctx.moveTo(282, 460);
    ctx.lineTo(300, 400);
    ctx.lineTo(318, 460);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b85a1e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 402);
    ctx.lineTo(300, 458);
    ctx.stroke();
  } else if (id === 'fire') {
    ctx.fillStyle = '#23402a';
    ctx.fillRect(262, 448, 76, 56);
    drawFire(ctx, 300, 496, 0.55);
  } else if (id === 'shooting') {
    ctx.save();
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(96, 62);
    ctx.lineTo(150, 100);
    ctx.stroke();
    circle(ctx, 150, 100, 3.5, '#fff');
    ctx.restore();
  } else if (id === 'marshmallow') {
    ctx.fillStyle = '#23402a';
    ctx.fillRect(418, 436, 26, 26);
    ctx.strokeStyle = '#8a6d3b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(470, 478);
    ctx.lineTo(428, 448);
    ctx.stroke();
  } else if (id === 'nest') {
    ctx.fillStyle = '#6b4226';
    ctx.beginPath();
    ctx.ellipse(92, 296, 16, 7, 0, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#4a2f1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 292);
    ctx.lineTo(104, 292);
    ctx.moveTo(84, 296);
    ctx.lineTo(100, 296);
    ctx.stroke();
  } else if (id === 'craters') {
    circle(ctx, 516, 64, 5, '#d9cfb8');
    circle(ctx, 534, 78, 4, '#d9cfb8');
    circle(ctx, 522, 84, 3, '#d9cfb8');
  }
}

// ------------------------------------------------------------------ entry
const BASE_DRAW = [drawGardenBase, drawCafeBase, drawCampBase];
const DIFF_DRAW = [drawGardenDiff, drawCafeDiff, drawCampDiff];

export function drawScene(ctx, levelIndex, panelX) {
  const level = LEVELS[levelIndex];
  ctx.save();
  ctx.translate(panelX, PANEL.y);
  ctx.beginPath();
  ctx.rect(0, 0, PANEL.w, PANEL.h);
  ctx.clip();
  BASE_DRAW[levelIndex](ctx, level);
  ctx.restore();
}

export function drawDifference(ctx, levelIndex, diffId, panelX) {
  const level = LEVELS[levelIndex];
  ctx.save();
  ctx.translate(panelX, PANEL.y);
  ctx.beginPath();
  ctx.rect(0, 0, PANEL.w, PANEL.h);
  ctx.clip();
  DIFF_DRAW[levelIndex](ctx, level, diffId);
  ctx.restore();
}
