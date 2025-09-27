import { useId } from 'react';

export default function Radio({
  label = '',
  name = '',
  value = '',
  checked = false,
  onChange = () => {},
  disabled = false,
  required = false,
  error = false,
}) {
  // 고유 id 생성
  const radioId = useId();

  // 함수 안전 처리
  const safeOnChange = typeof onChange === 'function' ? onChange : () => {};

  // style 처리
  const className = `radio${error ? ' radio--error' : ''}${
    disabled ? ' radio--disabled' : ''
  }`;

  // Handle change
  const handleChange = (e) => {
    if (disabled) return;
    safeOnChange(e);
  };

  return (
    <div className={className}>
      <input
        type="radio"
        id={radioId}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className="radio__input"
        aria-invalid={error}
      />
      <label className="radio__label" htmlFor={radioId}>
        {label}
      </label>
    </div>
  );
}
