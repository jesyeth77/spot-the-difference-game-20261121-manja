// Procedural sound for Twin Lantern Garden — WebAudio oscillators only,
// no audio files, no network. A tiny synth: short blips and chimes.

let audioCtx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

function ctx() {
  if (!audioCtx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
    } catch {
      audioCtx = null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, at, dur, type, vol) {
  const ac = ctx();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + at);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

export function sfxFound(combo) {
  // A bright two-note chime that climbs with the combo.
  const base = 620 + Math.min(combo, 5) * 40;
  tone(base, 0, 0.16, 'sine', 0.16);
  tone(base * 1.5, 0.07, 0.22, 'sine', 0.14);
}

export function sfxMiss() {
  tone(140, 0, 0.18, 'triangle', 0.14);
  tone(105, 0.05, 0.2, 'triangle', 0.1);
}

export function sfxHint() {
  tone(880, 0, 0.12, 'sine', 0.1);
  tone(1174, 0.08, 0.16, 'sine', 0.08);
}

export function sfxLevelClear() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.22, 'sine', 0.14));
}

export function sfxWin() {
  [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, i * 0.11, 0.3, 'sine', 0.13));
}

export function sfxLose() {
  [392, 330, 262, 196].forEach((f, i) => tone(f, i * 0.14, 0.28, 'triangle', 0.12));
}

export function sfxClick() {
  tone(440, 0, 0.06, 'sine', 0.07);
}
