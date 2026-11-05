// 画面の切り替え。決定した場所からドットが広がって画面を覆い、次の画面を描いたあと、同じ場所から開く

let origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let covered = false;

const CELL = 18;
const EDGE = 90; // 波の先のぼかし幅

/** 次の切り替えを始める場所を決める。決定した項目やクリックした場所を渡す */
export const setOrigin = (x: number, y: number) => {
  origin = { x, y };
};

export const isCovered = () => covered;

const run = (dir: 1 | -1) =>
  new Promise<void>((resolve) => {
    const canvas = document.getElementById('wipe');
    if (!(canvas instanceof HTMLCanvasElement)) return resolve();
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve();
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const { x: ox, y: oy } = origin;
    const maxD = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy)) + EDGE;
    const duration = dir > 0 ? 260 : 320;
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
    const t0 = performance.now();

    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const R = p * maxD;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = ink;
      for (let y = 0; y <= H + CELL; y += CELL) {
        for (let x = 0; x <= W + CELL; x += CELL) {
          let k = Math.max(0, Math.min(1, (R - Math.hypot(x - ox, y - oy)) / EDGE));
          if (dir < 0) k = 1 - k;
          if (k > 0) {
            const s = CELL * 1.08 * k;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
          }
        }
      }
      if (p < 1) requestAnimationFrame(frame);
      else {
        if (dir < 0) ctx.clearRect(0, 0, W, H);
        resolve();
      }
    };
    requestAnimationFrame(frame);
  });

export const cover = async () => {
  await run(1);
  covered = true;
};

export const reveal = async () => {
  if (!covered) return;
  covered = false;
  await run(-1);
};
