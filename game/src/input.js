// Twin Lantern Garden — mouse and keyboard.
// One clear job: turn clicks and keys into World calls. It owns the hit
// tests (which panel, which footer button) and nothing else.

import { PANEL, LEFT_X, RIGHT_X } from './config.js';
import { BUTTONS } from './render.js';
import { toggleMute, sfxClick } from './audio.js';

function inRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

export function attachInput(canvas, world) {
  function canvasPos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  canvas.addEventListener('click', (event) => {
    const { x, y } = canvasPos(event);
    if (world.screen === 'title') {
      sfxClick();
      world.startGame();
      return;
    }
    if (world.screen === 'levelclear') {
      world.advance();
      return;
    }
    if (world.screen === 'win' || world.screen === 'lose') {
      world.startGame();
      return;
    }
    if (world.screen === 'paused') {
      world.resume();
      return;
    }
    if (world.screen !== 'play') return;
    if (inRect(x, y, BUTTONS.hint)) {
      world.useHint();
      return;
    }
    if (inRect(x, y, BUTTONS.mute)) {
      toggleMute();
      return;
    }
    if (y >= PANEL.y && y <= PANEL.y + PANEL.h) {
      if (x >= LEFT_X && x <= LEFT_X + PANEL.w) {
        world.clickAt('left', x - LEFT_X, y - PANEL.y);
      } else if (x >= RIGHT_X && x <= RIGHT_X + PANEL.w) {
        world.clickAt('right', x - RIGHT_X, y - PANEL.y);
      }
    }
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'enter') {
      if (world.screen === 'title') world.startGame();
      else if (world.screen === 'levelclear') world.advance();
      else if (world.screen === 'win' || world.screen === 'lose') world.startGame();
    } else if (key === 'h') {
      world.useHint();
    } else if (key === 'p' || key === 'escape') {
      if (world.screen === 'play') world.pause();
      else if (world.screen === 'paused') world.resume();
    } else if (key === 'm') {
      toggleMute();
    } else if (key === 'r') {
      if (world.screen === 'win' || world.screen === 'lose' || world.screen === 'paused' || world.screen === 'play') {
        world.startGame();
      }
    }
  });
}
