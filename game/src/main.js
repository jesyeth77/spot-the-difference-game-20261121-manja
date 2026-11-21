// Twin Lantern Garden — boot and frame loop.
// One clear job: own the canvas, the clock and the first render. The rules
// live in world.js, the pictures in render.js, the input in input.js.

import { CANVAS_W, CANVAS_H } from './config.js';
import { World } from './world.js';
import { draw } from './render.js';
import { attachInput } from './input.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const world = new World();
window.__game = world;

attachInput(canvas, world);
stageShot(world);

let last = performance.now();
let frames = 0;
let readyAt = 0;

function frame(now) {
  const dt = Math.min(100, now - last);
  last = now;
  world.tick(now, dt);
  draw(ctx, world, now);
  frames += 1;
  // The screenshot driver waits for this flag: three frames rendered and a
  // short settle, so pulsing text and markers have landed.
  if (frames === 3) readyAt = now + 250;
  if (readyAt && now >= readyAt && !window.__shotReady) window.__shotReady = true;
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
