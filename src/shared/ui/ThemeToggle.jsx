/**
 * 프리미티브 UI 컴포넌트
 * 라디오 3단 토글(light/dark/system)
 */
import { useTheme } from '@/shared/lib/theme';

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <fieldset className="theme-toggle" aria-label="Theme mode">
      {['light', 'dark', 'system'].map((opt) => (
        <label
          key={opt}
          className={`theme-toggle__item ${mode === opt ? 'is-active' : ''}`}
        >
          <input
            type="radio"
            name="theme"
            value={opt}
            checked={mode === opt}
            onChange={() => setMode(opt)}
          />
          <span className="theme-toggle__text">
            {opt === 'light' ? 'Light' : opt === 'dark' ? 'Dark' : 'System'}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
