import { useState } from 'react';

export default function InputBox({
  type = 'text', // "text" | "number"
  label = '',
  name = '',
  placeholder = '',
  value = '',
  onChange = () => {},
  variant = 'default', // 'default' | 'search' | 'price' | 'size'
  disabled = false,
  required = false,
  iconClass = '', // 'ic-search' | 'ic-close' | 'ic-user'
  iconPosition = 'left', // 'left' | 'right'
  maxLength,
  clear = false,
  onClear = () => {},
  prefix = '', // "총장", etc
  suffix = '', // '원'  | 'cm' , etc
}) {
  const className = `input-box input-box--${variant}`;
  const showClear = clear && value && value.length > 0;

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

      {prefix && <span className="input-box__prefix">{prefix}</span>}

      <div className="input-box__container">
        <input
          type={type}
          className="input-box__input"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          aria-label={label}
          data-variant={variant}
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
