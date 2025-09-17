export default function InputBox({
  type = 'text', // ex. 'text' |'number'
  label = '',
  name = '',
  placeholder = '',
  value = '',
  onChange = () => {},
  variant = 'default',
  size = '',
  iconClass = '', // ex. 'ic-search' | 'ic-close' | 'ic-user'
  iconPosition = 'left',
  maxLength,
  clear = false,
  onClear = () => {},
  prefix = '', // ex. "총장"
  suffix = '', // ex. '원'  | 'cm'
  disabled = false,
  required = false,
  error = false,
}) {
  // 허용 variant, size, iconPosition 값 세트
  const VARIANTS = ['default', 'search', 'number'];
  const SIZES = ['--s', '', '--l'];
  const POSITIONS = ['left', 'right'];

  // variant, size, iconPosition 안전 처리 (fallback 적용)
  const safeVariant = VARIANTS.includes(variant) ? variant : 'default';
  const safeSize = SIZES.includes(size) ? size : '';
  const safeIconPosition = POSITIONS.includes(iconPosition)
    ? iconPosition
    : 'left';

  // 함수 안전 처리
  const safeOnChange = typeof onChange === 'function' ? onChange : () => {};
  const safeOnClear = typeof onClear === 'function' ? onClear : () => {};

  const showClear = clear && value && value.length > 0;
  const hasIconLeft = iconClass && safeIconPosition === 'left';
  const hasIconRight = iconClass && safeIconPosition === 'right';
  const hasPrefix = prefix && prefix.length > 0;
  const hasSuffix = suffix && suffix.length > 0;

  const className = `input-box${safeSize ? ` input-box${safeSize}` : ''} input-box--${safeVariant}${
    hasIconLeft ? ' input-box--has-icon-left' : ''
  }${hasIconRight ? ' input-box--has-icon-right' : ''}${
    hasPrefix ? ' input-box--has-prefix' : ''
  }${hasSuffix ? ' input-box--has-suffix' : ''}${
    showClear ? ' input-box--has-clear' : ''
  }${error ? ' input-box--error' : ''}`;

  // Handle clear button click
  const handleClear = () => {
    safeOnClear();
    // Create synthetic event for consistency
    const syntheticEvent = {
      target: { name, value: '' },
      currentTarget: { name, value: '' },
    };
    safeOnChange(syntheticEvent);
  };

  return (
    <div className={className}>
      {label && (
        <label className="input-box__label" htmlFor={name}>
          {label}
          {required && <span className="input-box__required">*</span>}
        </label>
      )}

      <div className={`input-box__container`}>
        {hasPrefix && <span className="input-box__prefix">{prefix}</span>}

        <input
          type={type}
          className="input-box__input"
          id={name}
          name={name}
          value={value}
          onChange={safeOnChange}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-label={label}
          data-variant={safeVariant}
          disabled={disabled}
          required={required}
        />

        {showClear && (
          <button
            type="button"
            className="input-box__clear-btn"
            onClick={handleClear}
            aria-label="Clear input"
          >
            <span className="ic-close"></span>
          </button>
        )}

        {hasSuffix && <span className="input-box__suffix">{suffix}</span>}

        {iconClass && (
          <span className={`${iconClass} ${safeIconPosition}`}></span>
        )}
      </div>
    </div>
  );
}
