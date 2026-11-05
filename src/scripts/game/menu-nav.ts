import { navigate } from 'astro:transitions/client';

import { beep } from './sound';
import { poke } from './dot-field';
import { setOrigin } from './wipe';
import { toast } from './toast';

// メニューの選択と操作。項目は普通のリンクで、ここでは「どれを選んでいるか」と
// キーボード・コントローラーの操作だけを扱う。移動そのものは Astro の ClientRouter に任せる

const PREV_PATH = 'game:prev-path';
const LAST_PICK = 'game:last:';

let items: HTMLAnchorElement[] = [];
let sel = -1;
let navByKeys = false;

const session = {
  get: (k: string): string | null => {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      sessionStorage.setItem(k, v);
    } catch {
      // 保存できない環境では、戻ったときの選択を覚えない
    }
  },
};

const norm = (p: string) => p.replace(/\/+$/, '') || '/';
const pathOf = (a: HTMLAnchorElement): string | null => {
  const u = new URL(a.href, location.href);
  return u.origin === location.origin ? norm(u.pathname) : null;
};
const app = () => document.querySelector<HTMLElement>('.app');

/** 作品の詳細や記事のように縦に読む画面では、矢印キーはページのスクロールに残す */
const isReadingPage = () => app()?.dataset.reading === 'true';

const showPreview = (key?: string) => {
  const pane = document.querySelector('[data-preview-pane]');
  if (!pane || !key) return;
  pane.querySelectorAll<HTMLElement>('[data-preview-for]').forEach((el) => {
    el.hidden = el.dataset.previewFor !== key;
    if (!el.hidden) {
      el.classList.remove('side-in');
      void el.offsetWidth;
      el.classList.add('side-in');
    }
  });
};

const select = (i: number, silent = false) => {
  if (!items.length) return;
  const next = ((i % items.length) + items.length) % items.length;
  if (next === sel) return;
  sel = next;
  document.querySelectorAll<HTMLAnchorElement>('[data-menu] a[data-item]').forEach((a) => {
    const on = a === items[sel];
    a.classList.toggle('is-selected', on);
    a.tabIndex = on ? 0 : -1;
  });
  showPreview(items[sel].dataset.preview);
  if (!silent) {
    beep('move');
    const r = items[sel].getBoundingClientRect();
    poke(r.left + 8, r.top + r.height / 2, 3.2);
    items[sel].scrollIntoView({ block: 'nearest' });
  }
};

const originFrom = (el: Element | null) => {
  if (!el) return setOrigin(window.innerWidth / 2, window.innerHeight / 2);
  const r = el.getBoundingClientRect();
  setOrigin(r.left + 10, r.top + r.height / 2);
};

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast('コピーしました');
  } catch {
    toast('コピーできませんでした。表示中のアドレスを選んでコピーしてください');
  }
};

const onActivate = (e: MouseEvent) => {
  const a = e.currentTarget as HTMLAnchorElement;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  if (a.dataset.copy) {
    e.preventDefault();
    beep('confirm');
    copyText(a.dataset.copy);
    return;
  }
  if (a.dataset.notice) {
    e.preventDefault();
    beep('back');
    toast(a.dataset.notice);
    return;
  }
  beep('confirm');
  if (a.target === '_blank') return;
  session.set(LAST_PICK + norm(location.pathname), a.getAttribute('href') ?? '');
  navByKeys = e.detail === 0;
  if (navByKeys) originFrom(a);
  else setOrigin(e.clientX, e.clientY);
  poke(e.clientX || a.getBoundingClientRect().left, e.clientY || a.getBoundingClientRect().top, 6, 1);
};

const collect = () => {
  items = [...document.querySelectorAll<HTMLAnchorElement>('[data-menu] a[data-item]')].filter(
    (a) => !a.closest('li')?.hidden
  );
};

const setTab = (id: string, silent = false) => {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-tab]')];
  if (!tabs.length) return;
  tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.tab === id)));
  document.querySelectorAll<HTMLLIElement>('[data-menu] li[data-category]').forEach((li) => {
    li.hidden = id !== 'all' && li.dataset.category !== id;
  });
  const empty = document.querySelector<HTMLElement>('[data-menu-empty]');
  collect();
  if (empty) empty.hidden = items.length > 0;
  sel = -1;
  select(0, true);
  if (!silent) beep('move');
};

/** ページを読み込むたびに呼ぶ */
export const initMenu = () => {
  collect();
  sel = -1;
  // 子の画面から戻ってきたら、その子を選んだ状態にする。無ければ前に決定した項目
  const prev = session.get(PREV_PATH);
  const last = session.get(LAST_PICK + norm(location.pathname));
  let start = prev ? items.findIndex((a) => pathOf(a) === prev) : -1;
  if (start < 0 && last) start = items.findIndex((a) => a.getAttribute('href') === last);
  select(Math.max(0, start), true);

  items.forEach((a) => {
    a.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') select(items.indexOf(a));
    });
    a.addEventListener('focus', () => {
      const i = items.indexOf(a);
      if (i >= 0) select(i, true);
    });
    a.addEventListener('click', onActivate);
  });
  document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((t) => {
    t.addEventListener('click', () => setTab(t.dataset.tab ?? 'all'));
  });

  if (navByKeys && items[sel]) items[sel].focus({ preventScroll: true });
  navByKeys = false;
};

/** 移る直前に呼ぶ。戻ってきたときに、どの項目から来たかが分かるようにする */
export const rememberPath = () => session.set(PREV_PATH, norm(location.pathname));

export const move = (d: 1 | -1) => {
  if (!items.length) return;
  select(sel + d);
  items[sel].focus({ preventScroll: true });
};

export const confirmSelection = () => {
  items[sel]?.click();
};

export const back = () => {
  const parent = app()?.dataset.parent;
  if (!parent) return;
  beep('back');
  originFrom(items[sel] ?? null);
  navByKeys = true;
  navigate(parent);
};

export const cycleTab = (d: 1 | -1) => {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-tab]')];
  if (!tabs.length) return;
  const i = tabs.findIndex((t) => t.getAttribute('aria-pressed') === 'true');
  const next = tabs[(i + d + tabs.length) % tabs.length];
  setTab(next.dataset.tab ?? 'all');
  next.focus({ preventScroll: true });
};

export const neighbor = (d: 1 | -1) => {
  const href = d > 0 ? app()?.dataset.next : app()?.dataset.prev;
  if (!href) return;
  beep('confirm');
  setOrigin(d > 0 ? window.innerWidth - 40 : 40, window.innerHeight / 2);
  navByKeys = true;
  navigate(href);
};

let installed = false;

/** キー操作は最初の 1 回だけ登録する */
export const installKeys = () => {
  if (installed) return;
  installed = true;
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target instanceof HTMLElement ? e.target : document.body;
    if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
    const inMenu = !!t.closest('[data-menu]');
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        if (!items.length || (isReadingPage() && !inMenu)) return;
        e.preventDefault();
        move(e.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter':
        if (t.closest('a, button') || !items[sel] || isReadingPage()) return;
        e.preventDefault();
        confirmSelection();
        break;
      case 'Escape':
      case 'Backspace':
        e.preventDefault();
        back();
        break;
      case 'q':
      case 'Q':
      case 'e':
      case 'E':
        cycleTab(e.key.toLowerCase() === 'e' ? 1 : -1);
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        if (!app()?.dataset.next) return;
        e.preventDefault();
        neighbor(e.key === 'ArrowRight' ? 1 : -1);
        break;
    }
  });
};
