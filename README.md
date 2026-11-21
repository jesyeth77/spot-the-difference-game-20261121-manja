# spot-the-difference-game-20261121-manja

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/jesyeth77/spot-the-difference-game-20261121-manja/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/jesyeth77/spot-the-difference-game-20261121-manja/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Twin Lantern Garden — a cozy spot-the-difference game in your browser. Two
near-identical pictures side by side, seven differences hiding in each, and
ninety seconds to find them all.

## How to play

- **Mouse** — click a difference on either picture; a green ring marks it found
- **H** — hint (costs 50 points, 3 per level)
- **P** — pause, **M** — mute, **Enter** — start, **R** — restart

Three hand-drawn scenes: a lantern garden pond at dusk, a cozy café window in
the rain, and a starlit campsite. Wrong clicks cost 5 seconds; finds chained
together raise the combo multiplier up to ×5. Clear a level with time to spare
for a time bonus, and find all 21 differences to win.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step, no
libraries, no network — the game is plain static files under `game/`.

To hand the entry in (what the grader runs):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

Entered on [make.fun](https://make.fun/?ref=psr3ppbr&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build
software for cash rewards
