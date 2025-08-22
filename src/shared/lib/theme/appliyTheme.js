/**
 * document.documentElement의 data-theme 조작
 * @param {*} mode
 */
export function applyTheme(mode) {
  const root = document.documentElement;

  if (mode === 'light') {
    root.setAttribute('data-theme', 'light');
  } else if (mode === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    // system: prefers-color-scheme에 위임
    root.removeAttribute('data-theme');
  }
}

export const getPreferredDark = () => {
  window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
};
