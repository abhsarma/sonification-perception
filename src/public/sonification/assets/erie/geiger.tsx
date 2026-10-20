// geiger.js — Geiger counter sound emulation with the Web Audio API.

// One click waveform: a few ms of white noise with a sharp exponential decay.
const clickSamples = (sampleRate: number, { duration = 0.004, decay = 0.0008 } = {}) =>
  Float32Array.from(
    { length: Math.floor(sampleRate * duration) },
    (_, i) => (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * decay))
  );

// ---------- Audio side effects ----------

const createClickBuffer = (ctx: BaseAudioContext) => {
  const samples = clickSamples(ctx.sampleRate);
  console.log(ctx.sampleRate);
  
  const buffer = ctx.createBuffer(1, samples.length, ctx.sampleRate);
  buffer.copyToChannel(samples, 0);
  return buffer;
};

// Band-pass filter gives the click the thin, sharp "tick" of a real counter.
const createTone = (ctx: BaseAudioContext, { frequency = 3000, q = 0.8 } = {}) => {
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = frequency;
  filter.Q.value = q;
  filter.connect(ctx.destination);
  return filter;
};

// Wires one click through the gain and band-pass filter into ctx's destination.
// Works with both a live AudioContext and an OfflineAudioContext.
const scheduleGeigerTone = (ctx: BaseAudioContext, volume: number) => {
  const buffer = createClickBuffer(ctx);
  const output = createTone(ctx);

  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.value = volume;
  source.connect(gain).connect(output);

  source.start(ctx.currentTime);
};

const playGeigerTone = (volume = 1) => {
  const ctx = new AudioContext();
  ctx.resume(); // browsers start audio suspended until a user gesture
  scheduleGeigerTone(ctx, volume);
}

export { playGeigerTone };