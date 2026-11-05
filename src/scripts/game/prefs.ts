// 効果音と「動きを減らす」の設定。その端末だけに覚えさせる

const KEYS = { calm: 'game:calm', sound: 'game:sound' } as const;
type PrefKey = keyof typeof KEYS;

const read = (k: string): string | null => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    // 保存できない環境（プライベートウィンドウなど）では、今のページの間だけ覚える
  }
};

const osReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const stored = { calm: read(KEYS.calm) === '1', sound: read(KEYS.sound) === '1' };
const listeners = new Set<() => void>();

/** OS で動きを減らしているときは、サイトの設定に関わらず止める */
export const isCalm = (): boolean => stored.calm || osReduced.matches;
export const isSoundOn = (): boolean => stored.sound;

export const onPrefsChange = (fn: () => void) => listeners.add(fn);

export const togglePref = (key: PrefKey) => {
  stored[key] = !stored[key];
  write(KEYS[key], stored[key] ? '1' : '0');
  applyPrefs();
  listeners.forEach((fn) => fn());
};

/** html のクラスとボタンの表示を、今の設定に合わせる。ページを移るたびに呼ぶ */
export const applyPrefs = () => {
  const root = document.documentElement;
  root.classList.add('js');
  root.classList.toggle('calm', isCalm());
  document.querySelectorAll<HTMLButtonElement>('[data-pref="sound"]').forEach((b) => {
    b.setAttribute('aria-pressed', String(stored.sound));
    b.textContent = stored.sound ? '効果音 オン' : '効果音 オフ';
  });
  document.querySelectorAll<HTMLButtonElement>('[data-pref="calm"]').forEach((b) => {
    b.setAttribute('aria-pressed', String(isCalm()));
    b.disabled = osReduced.matches;
    b.title = osReduced.matches ? '端末の設定で、動きを減らしています' : '';
  });
};

osReduced.addEventListener('change', () => {
  applyPrefs();
  listeners.forEach((fn) => fn());
});
