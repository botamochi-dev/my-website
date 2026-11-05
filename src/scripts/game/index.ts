import type { TransitionBeforePreparationEvent } from 'astro:transitions/client';

import { applyPrefs, isCalm, onPrefsChange, togglePref } from './prefs';
import { beep } from './sound';
import { calmDots, initDotField } from './dot-field';
import { cover, isCovered, reveal } from './wipe';
import { initMenu, installKeys, rememberPath } from './menu-nav';
import { installGamepad } from './gamepad';

// ゲームのメニュー画面の入り口。このファイルはページをまたいで 1 回だけ読み込まれるので、
// 登録は 1 回、ページごとの準備は astro:page-load で行う

let unmountWarp: (() => void) | null = null;

const mountWarpIfAny = async () => {
  const host = document.querySelector<HTMLElement>('[data-warp]');
  if (!host || isCalm()) return;
  await document.fonts?.load('900 100px "Roboto Flex"');
  const { mountWarp } = await import('./warp-title');
  unmountWarp = mountWarp(host);
};

const stopWarp = () => {
  unmountWarp?.();
  unmountWarp = null;
};

installKeys();
installGamepad();

document.addEventListener('click', (e) => {
  const btn = e.target instanceof Element ? e.target.closest<HTMLButtonElement>('[data-pref]') : null;
  if (!btn) return;
  const key = btn.dataset.pref === 'sound' ? 'sound' : 'calm';
  togglePref(key);
  beep('toggle');
});

onPrefsChange(() => {
  if (isCalm()) {
    calmDots();
    stopWarp();
  } else if (!unmountWarp) mountWarpIfAny();
});

// 決定してから次のページを読み込む間、ドットで画面を覆う。覆い終わるのと読み込み終わるのを両方待つ
document.addEventListener('astro:before-preparation', (event) => {
  const e = event as TransitionBeforePreparationEvent;
  rememberPath();
  if (isCalm()) return;
  const load = e.loader;
  e.loader = async () => {
    await Promise.all([load(), cover()]);
  };
});

document.addEventListener('astro:before-swap', stopWarp);
document.addEventListener('astro:after-swap', applyPrefs);

document.addEventListener('astro:page-load', () => {
  applyPrefs();
  initDotField();
  initMenu();
  mountWarpIfAny();
  if (isCovered()) reveal();
});
