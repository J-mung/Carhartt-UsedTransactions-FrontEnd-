import { useState } from 'react';

export default function InputBox({
  type = 'text', // "text" | "number"
  label = '',
  name = '',
  placeholder = '',
  value = '',
  onChange = () => {},
  variant = 'default', // default | search | number
  iconClass = '', // 'ic-search' | 'ic-close' | 'ic-user'
  iconPosition = 'left', // 'left' | 'right'
  maxLength,
  clear = false,
  onClear = () => {},
  prefix = '', // "총장", etc
  suffix = '', // '원'  | 'cm' , etc
  disabled = false,
  required = false,
  error = false,
}) {
  const showClear = clear && value && value.length > 0;
  const hasIconLeft = iconClass && iconPosition === 'left';
  const hasPrefix = prefix && prefix.length > 0;

  const className = `input-box input-box--${variant}${
    hasIconLeft ? ' input-box--has-icon-left' : ''
  }${hasPrefix ? ' input-box--has-prefix' : ''}${error ? ' input-box--error' : ''}`;

  // Handle clear button click
  const handleClear = () => {
    onClear();
    // Create synthetic event for consistency
    const syntheticEvent = {
      target: { name, value: '' },
      currentTarget: { name, value: '' },
    };
    onChange(syntheticEvent);
  };

  return (
    <div className={className}>
      {label && (
        <label className="input-box__label" htmlFor={name}>
          {label}
          {required && <span className="input-box__required">*</span>}
        </label>
      )}

      <div className="input-box__container">
        {prefix && <span className="input-box__prefix">{prefix}</span>}

        <input
          type={type}
          className="input-box__input"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-label={label}
          data-variant={variant}
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

        {suffix && <span className="input-box__suffix">{suffix}</span>}

        {iconClass && <span className={`${iconClass} ${iconPosition}`}></span>}
      </div>
    </div>
  );
}
