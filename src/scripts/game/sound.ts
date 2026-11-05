import { isSoundOn } from './prefs';

// 選ぶ・決定・戻るの短い矩形波。音のファイルは使わない
const TONES = { move: [660, 0.05], confirm: [990, 0.08], back: [440, 0.08], toggle: [880, 0.05] } as const;
export type Tone = keyof typeof TONES;

let ctx: AudioContext | null = null;

export const beep = (tone: Tone) => {
  if (!isSoundOn()) return;
  try {
    ctx ??= new AudioContext();
    const [freq, dur] = TONES[tone];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.value = 0.035;
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch {
    // 音が出せない環境では鳴らさない
  }
};
