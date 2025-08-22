/**
 * localStorage 저장/로드 (theme-mode)
 */
export const STORAGE_KEY = 'theme-mode'; // 'light' | 'dark' | 'system'
const ALLOWED = new Set(['light', 'dark', 'system']);

// 허용되는 모드 이외의 값은 모두 null 처리
export function sanitizeMode(value) {
  if (typeof value !== 'string') return null;
  const sanitize = value.trim().toLowerCase();

  return ALLOWED.has(sanitize) ? sanitize : null;
}

export const getStoredMode = (fallback = 'system') => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const sanitize = sanitizeMode(raw);

    // 전처리 결과 null이면 fallback 반환
    return sanitize ?? fallback;
  } catch {
    return fallback;
  }
};

export const setStoredMode = (mode) => {
  try {
    const sanitize = sanitizeMode(mode);

    if (sanitize) {
      localStorage.setItem(STORAGE_KEY, sanitize);
    } else {
      localStorage.removeItem(STORAGE_KEY); // 잘못된 값을 저장하면 제거
    }
  } catch {}
};
