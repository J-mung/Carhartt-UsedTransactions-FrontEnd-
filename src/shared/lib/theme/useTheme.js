/**
 * 컨텍스트 훅(mode, setMode, isDark)
 */
import { createContext, useContext } from 'react';

export const ThemeContext = createContext({
  mode: 'system',
  setMode: () => {},
  isDark: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}
