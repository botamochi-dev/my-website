import { back, confirmSelection, cycleTab, move, neighbor } from './menu-nav';

// コントローラー（Gamepad API）。つながったときだけ読み取りを回す。
// ボタンの番号は「標準の配置」に合わせる（0: A、1: B、4: LB、5: RB、12〜15: 十字キー）

const REPEAT_FIRST = 380;
const REPEAT_NEXT = 120;

let raf = 0;
let prev: boolean[] = [];
let repeatAt = 0;

const pads = (): Gamepad[] => {
  try {
    return [...(navigator.getGamepads?.() ?? [])].filter((p): p is Gamepad => !!p);
  } catch {
    return [];
  }
};

const poll = (now: number) => {
  const pad = pads()[0];
  if (!pad) {
    raf = 0;
    return;
  }
  const btn = (n: number) => !!pad.buttons[n]?.pressed;
  const ay = pad.axes[1] ?? 0;
  const st = [btn(12) || ay < -0.6, btn(13) || ay > 0.6, btn(0), btn(1), btn(4), btn(5), btn(14), btn(15)];
  const edge = (i: number) => st[i] && !prev[i];

  if (st[0] || st[1]) {
    const first = edge(0) || edge(1);
    if (first || now > repeatAt) {
      move(st[1] ? 1 : -1);
      repeatAt = now + (first ? REPEAT_FIRST : REPEAT_NEXT);
    }
  }
  if (edge(2)) confirmSelection();
  if (edge(3)) back();
  if (edge(4) || edge(5)) cycleTab(edge(5) ? 1 : -1);
  if (edge(6) || edge(7)) neighbor(edge(7) ? 1 : -1);
  prev = st;
  raf = requestAnimationFrame(poll);
};

let installed = false;

export const installGamepad = () => {
  if (installed || !('getGamepads' in navigator)) return;
  installed = true;
  window.addEventListener('gamepadconnected', () => {
    if (!raf) raf = requestAnimationFrame(poll);
  });
};
