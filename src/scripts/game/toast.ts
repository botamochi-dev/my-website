let timer = 0;

export const toast = (message: string) => {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-on');
  window.clearTimeout(timer);
  timer = window.setTimeout(() => el.classList.remove('is-on'), 1800);
};
