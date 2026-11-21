// Twin Lantern Garden — tuning, palettes and level definitions.
// One clear job: every number the game runs on lives here, so the art and the
// rules never hard-code a magic constant of their own.

export const CANVAS_W = 1280;
export const CANVAS_H = 800;

// The two picture panels. Both are drawn from the same scene function; the
// right one then gets the level's differences painted over it.
export const PANEL = { w: 600, h: 560, y: 96 };
export const LEFT_X = 24;
export const RIGHT_X = 656;
export const HEADER_H = 88;
export const FOOTER_Y = 664;

export const LEVEL_TIME = 90; // seconds per level
export const WRONG_CLICK_PENALTY = 5; // seconds lost on a miss
export const HINTS_PER_LEVEL = 3;
export const HINT_COST = 50;
export const FIND_BASE = 100;
export const MAX_COMBO = 5;
export const LEVEL_CLEAR_BONUS_PER_SECOND = 10;

export const STORAGE_BEST = 'twin-lantern-garden-best';

// Difference: { id, name, x, y, r } — x/y/r in panel coordinates (600 x 560).
// The art in scenes.js knows how to paint each one onto the right panel.
export const LEVELS = [
  {
    id: 0,
    name: 'Lantern Garden Pond',
    tagline: 'Dusk settles over the pond. The lanterns are lit.',
    skyTop: '#2b2350',
    skyBottom: '#4d7a6a',
    diffs: [
      { id: 'moon', name: 'The moon turned full', x: 92, y: 74, r: 34 },
      { id: 'lantern', name: 'A lantern went out', x: 300, y: 78, r: 30 },
      { id: 'koi', name: 'The koi changed colour', x: 205, y: 392, r: 34 },
      { id: 'tulip', name: 'An extra tulip bloomed', x: 522, y: 498, r: 26 },
      { id: 'frog', name: 'The frog hopped away', x: 432, y: 428, r: 28 },
      { id: 'lotus', name: 'A lotus opened on the pond', x: 152, y: 452, r: 26 },
      { id: 'firefly', name: 'One more firefly is glowing', x: 545, y: 128, r: 18 },
    ],
  },
  {
    id: 1,
    name: 'Cozy Café Window',
    tagline: 'Rain on the glass, coffee going cold, cat asleep.',
    skyTop: '#1d2b4a',
    skyBottom: '#7a4d3a',
    diffs: [
      { id: 'rain', name: 'The rain stopped on the glass', x: 150, y: 190, r: 40 },
      { id: 'tail', name: 'The cat curled its tail', x: 428, y: 316, r: 30 },
      { id: 'cup', name: 'A coffee cup changed colour', x: 252, y: 428, r: 28 },
      { id: 'books', name: 'A book vanished from the stack', x: 482, y: 388, r: 28 },
      { id: 'picture', name: 'The picture shows the sun now', x: 522, y: 118, r: 30 },
      { id: 'plant', name: 'The plant grew a flower', x: 92, y: 356, r: 26 },
      { id: 'lamp', name: 'The hanging lamp went dark', x: 300, y: 66, r: 30 },
    ],
  },
  {
    id: 2,
    name: 'Starlit Campsite',
    tagline: 'The fire crackles. Something watches from the pines.',
    skyTop: '#101736',
    skyBottom: '#274b63',
    diffs: [
      { id: 'owl', name: 'The owl flew away', x: 502, y: 112, r: 28 },
      { id: 'tent', name: 'The tent door closed', x: 300, y: 408, r: 36 },
      { id: 'fire', name: 'The campfire burned lower', x: 300, y: 488, r: 34 },
      { id: 'shooting', name: 'A shooting star crossed the sky', x: 122, y: 82, r: 26 },
      { id: 'marshmallow', name: 'A marshmallow went missing', x: 432, y: 462, r: 24 },
      { id: 'nest', name: 'A nest appeared in the pine', x: 92, y: 302, r: 26 },
      { id: 'craters', name: 'Craters appeared on the moon', x: 524, y: 72, r: 32 },
    ],
  },
];
