/**
 * 시스템 Dark 감지, 상태 보관, 컨텍스트 제공
 */
import { useEffect, useMemo, useState } from 'react';

import { applyTheme, getPreferredDark } from './appliyTheme';
import { getStoredMode, setStoredMode } from './storage';
import { ThemeContext } from './useTheme';

export default function ThemeProvider({ initial = 'system', children }) {
  const [mode, setMode] = useState(() => getStoredMode(initial));

  // 시스템 변경 반영
  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (getStoredMode('system') === 'system') applyTheme('system');
    };
    mql?.addEventListener('change', onChange);
    return () => {
      mql?.removeEventListener?.('change', onChange);
    };
  }, []);

  useEffect(() => {
    setStoredMode(mode);
    applyTheme(mode);
  }, [mode]);

  const isDark = useMemo(() => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return getPreferredDark();
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
