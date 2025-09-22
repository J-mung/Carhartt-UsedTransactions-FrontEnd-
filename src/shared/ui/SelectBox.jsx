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

  // Normalize options
  const normalizedOptions = options.map((option) => {
    if (typeof option === 'string') {
      return { value: option, label: option };
    }
    return option;
  });

  // 중복 value 체크
  const values = normalizedOptions.map((option) => option.value);
  const hasDuplicateValues = values.length !== new Set(values).size;

  // error 처리
  const showError = error || hasDuplicateValues;
  const showErrorMessage =
    errorMessage || (hasDuplicateValues ? '옵션에 중복된 값이 있습니다' : '');

  // disabled 처리
  const isDisabled = disabled || hasDuplicateValues;

  // style 처리
  const className = `select-box${safeSize ? ` select-box${safeSize}` : ''} ${
    showError ? ' select-box--error' : ''
  }${isOpen ? ' select-box--open' : ''}`;

  // toggle 처리
  const handleToggle = () => {
    if (isDisabled) return;
    setIsOpen(!isOpen);
  };

  // focus 처리
  const handleFocus = (e) => {
    if (isDisabled) {
      e.preventDefault();
      e.target.blur();
    }
  };

  // Find selected option
  const selectedOption = normalizedOptions.find(
    (option) => option.value === value
  );
  const displayText = selectedOption
    ? selectedOption.label
    : placeholder || '선택하세요';

  // Handle option select
  const handleOptionSelect = (optionValue) => {
    if (isDisabled) return;
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
          tabIndex={isDisabled ? -1 : 0}
          aria-disabled={isDisabled}
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
            <span className="ic-right--xs"></span>
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

      {showError && showErrorMessage && (
        <div className="select-box__error-message">{showErrorMessage}</div>
      )}
    </div>
  );
}
