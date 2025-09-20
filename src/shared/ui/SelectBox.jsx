import { useState, useRef, useEffect } from 'react';

export default function SelectBox({
  label = '',
  name = '',
  placeholder = '',
  value = '',
  onChange = () => {},
  options = [],
  size = '',
  disabled = false,
  required = false,
  error = false,
  errorMessage = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // 허용 size 값 세트 & 안전 처리
  const SIZES = ['--s', '', '--l'];
  const safeSize = SIZES.includes(size) ? size : '';

  // 함수 안전 처리
  const safeOnChange = typeof onChange === 'function' ? onChange : () => {};

  // style 처리
  const className = `select-box${safeSize ? ` select-box${safeSize}` : ''} ${
    error ? ' select-box--error' : ''
  }${isOpen ? ' select-box--open' : ''}`;

  // Handle toggle
  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  // Handle focus
  const handleFocus = (e) => {
    if (disabled) {
      e.preventDefault();
      e.target.blur();
    }
  };

  // Normalize options
  const normalizedOptions = options.map((option) => {
    if (typeof option === 'string') {
      return { value: option, label: option };
    }
    return option;
  });

  // Find selected option
  const selectedOption = normalizedOptions.find(
    (option) => option.value === value
  );
  const displayText = selectedOption
    ? selectedOption.label
    : placeholder || '선택하세요';

  // Handle option select
  const handleOptionSelect = (optionValue) => {
    if (disabled) return;
    const syntheticEvent = {
      target: { name, value: optionValue },
      currentTarget: { name, value: optionValue },
    };
    safeOnChange(syntheticEvent);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={className} ref={containerRef}>
      {label && (
        <label className="select-box__label" htmlFor={name}>
          {required && <span className="select-box__required">*</span>}
          {label}
        </label>
      )}

      <div className="select-box__container">
        <div
          id={name}
          name={name}
          className="select-box__select"
          onClick={handleToggle}
          onFocus={handleFocus}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-label={label}
        >
          <span
            className={
              selectedOption ? 'select-box__text' : 'select-box__placeholder'
            }
          >
            {displayText}
          </span>

          <span className="select-box__arrow">
            <span className="ic-right"></span>
          </span>
        </div>

        {isOpen && (
          <div className="select-box__dropdown" ref={listRef}>
            <ul className="select-box__list">
              {normalizedOptions.map((option, index) => (
                <li
                  key={option.value || index}
                  className={`select-box__option ${
                    value === option.value ? 'select-box__option--selected' : ''
                  }`}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <input type="hidden" name={name} value={value} required={required} />
      </div>

      {error && errorMessage && (
        <div className="select-box__error-message">{errorMessage}</div>
      )}
    </div>
  );
}
