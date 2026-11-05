import { isCalm } from './prefs';

// 背景のドットの波。網目の 1 点ずつの高さを波動方程式で動かし、高さに合わせてドットを大きく濃くする。
// 波が収まったら計算を止めるので、触っていない間は何もしない

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;
let dpr = 1;
let cell = 16;
let cols = 0;
let rows = 0;
let h0 = new Float32Array(0);
let h1 = new Float32Array(0);
let ink = '#1A1E5C';
let running = false;
let quietFrames = 0;
let lastPoke: { x: number; y: number } | null = null;

const DAMPING = 0.972;

const readInk = () => getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || ink;

const draw = () => {
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = ink;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const v = Math.abs(h0[y * cols + x]);
      const s = 1.6 + Math.min(cell * 0.5, v * 2.2);
      ctx.globalAlpha = Math.min(0.5, 0.13 + v * 0.16);
      ctx.fillRect(x * cell - s / 2, y * cell - s / 2, s, s);
    }
  }
  ctx.globalAlpha = 1;
};

const resize = () => {
  if (!canvas) return;
  dpr = Math.min(1.5, window.devicePixelRatio || 1);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  cell = width < 600 ? 14 : 16;
  cols = Math.ceil(width / cell) + 1;
  rows = Math.ceil(height / cell) + 1;
  h0 = new Float32Array(cols * rows);
  h1 = new Float32Array(cols * rows);
  draw();
};

const tick = () => {
  if (!running) return;
  let energy = 0;
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      const i = y * cols + x;
      const n = ((h0[i - 1] + h0[i + 1] + h0[i - cols] + h0[i + cols]) * 0.5 - h1[i]) * DAMPING;
      h1[i] = n;
      energy += Math.abs(n);
    }
  }
  [h0, h1] = [h1, h0];
  draw();
  quietFrames = energy < cols * rows * 0.002 ? quietFrames + 1 : 0;
  if (quietFrames > 90) {
    running = false;
    return;
  }
  requestAnimationFrame(tick);
};

const wake = () => {
  if (running || isCalm() || document.hidden) return;
  running = true;
  quietFrames = 0;
  requestAnimationFrame(tick);
};

/** (x, y) のまわりに波を立てる。座標は画面の左上からの CSS ピクセル */
export const poke = (x: number, y: number, amount: number, radius = 1) => {
  if (!ctx || isCalm()) return;
  const cx = Math.round(x / cell);
  const cy = Math.round(y / cell);
  for (let j = -radius; j <= radius; j++) {
    for (let i = -radius; i <= radius; i++) {
      const X = cx + i;
      const Y = cy + j;
      if (X > 0 && Y > 0 && X < cols - 1 && Y < rows - 1 && i * i + j * j <= radius * radius)
        h0[Y * cols + X] += amount;
    }
  }
  wake();
};

/** 波を消して、静かな網目だけにする（「動きを減らす」を切り替えたときなど） */
export const calmDots = () => {
  h0.fill(0);
  h1.fill(0);
  running = false;
  draw();
};

/** ページを読み込むたびに呼ぶ。canvas はページをまたいで使い回すので、準備は最初の 1 回だけ */
export const initDotField = () => {
  const el = document.getElementById('dot-field');
  if (!(el instanceof HTMLCanvasElement)) return;
  if (el === canvas) {
    ink = readInk();
    draw();
    return;
  }
  canvas = el;
  ctx = el.getContext('2d');
  ink = readInk();
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      if (lastPoke && Math.hypot(e.clientX - lastPoke.x, e.clientY - lastPoke.y) < cell) return;
      lastPoke = { x: e.clientX, y: e.clientY };
      poke(e.clientX, e.clientY, 1.4);
    },
    { passive: true }
  );
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) running = false;
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    ink = readInk();
    draw();
  });
};
