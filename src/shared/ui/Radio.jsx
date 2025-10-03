import { useId } from 'react';

export default function RadioGroup({
  label = '',
  name = '',
  value = '',
  defaultKey = '',
  onChange = () => {},
  options = [],
  size = '',
  disabled = false,
  required = false,
  error = false,
  variant = 'radio', // 'radio' | 'button'
  showNavigation = false,
  onNavigate = () => {},
}) {
  const radioGroupId = useId();

  // 허용 size 값 세트 & 안전 처리
  const SIZES = ['--s', '', '--l'];
  const safeSize = SIZES.includes(size) ? size : '';

  // 함수 안전 처리
  const safeOnChange = typeof onChange === 'function' ? onChange : () => {};
  const safeOnNavigate =
    typeof onNavigate === 'function' ? onNavigate : () => {};

  // Normalize options
  const normalizedOptions = options
    .map((option, idx) => {
      if (typeof option === 'string' || typeof option === 'number') {
        return {
          key: option.toString(),
          value: option,
          label: option.toString(),
        };
      }

      if (!option.key || option.value === undefined) {
        return null;
      }

      return {
        key: option.key,
        value: option.value,
        label: option.label || option.value.toString(),
        disabled: option.disabled,
      };
    })
    .filter(Boolean);

  // 중복 key 체크
  const keys = normalizedOptions.map((option) => option.key);
  const hasDuplicateKeys = keys.length !== new Set(keys).size;

  // 중복 value 체크
  const values = normalizedOptions.map((option) => option.value);
  const hasDuplicateValues = values.length !== new Set(values).size;

  // error 처리
  const showError = error || hasDuplicateKeys || hasDuplicateValues;
  const showErrorMessage = hasDuplicateKeys
    ? '옵션에 중복된 키가 있습니다'
    : hasDuplicateValues
      ? '옵션에 중복된 값이 있습니다'
      : '';

  // current value 처리
  const getCurrentValue = () => {
    if (value) return value;
    if (defaultKey && !hasDuplicateKeys && !hasDuplicateValues) {
      const defaultOption = normalizedOptions.find(
        (option) => option.key === defaultKey
      );
      return defaultOption?.value || '';
    }
    return '';
  };

  const currentValue = getCurrentValue();

  // pagination을 위한 옵션 처리 (navigation & ellipsis)
  const processedOptions = (() => {
    if (!showNavigation || variant !== 'button') {
      return normalizedOptions;
    }

    const currentIndex = normalizedOptions.findIndex(
      (option) => option.value === currentValue
    );

    const isFirst = currentIndex <= 0;
    const isLast = currentIndex >= normalizedOptions.length - 1;

    // Max 5개의 페이지 버튼만 보이도록 처리
    const maxVisiblePages = 5;
    let visiblePages = [...normalizedOptions];

    if (normalizedOptions.length > maxVisiblePages) {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(0, currentIndex - halfVisible);
      let endPage = Math.min(
        normalizedOptions.length - 1,
        startPage + maxVisiblePages - 1
      );

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
      }

      visiblePages = [];

      // 항상 첫 페이지 표시
      if (startPage > 0) {
        visiblePages.push(normalizedOptions[0]);
        if (startPage > 1) {
          visiblePages.push({
            key: '__ellipsis-start',
            value: '__ellipsis-start',
            label: 'ic-ellipsis--xs',
            disabled: true,
            isEllipsis: true,
          });
        }
      }

      // 중간 페이지 표시
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(normalizedOptions[i]);
      }

      // 항상 마지막 페이지 표시
      if (endPage < normalizedOptions.length - 1) {
        if (endPage < normalizedOptions.length - 2) {
          visiblePages.push({
            key: '__ellipsis-end',
            value: '__ellipsis-end',
            label: 'ic-ellipsis--xs',
            disabled: true,
            isEllipsis: true,
          });
        }
        visiblePages.push(normalizedOptions[normalizedOptions.length - 1]);
      }
    }

    // 네비게이션 버튼
    return [
      {
        key: '__first',
        value: '__first',
        label: 'ic-first--xs',
        disabled: isFirst,
        isNavigation: true,
      },
      {
        key: '__prev',
        value: '__prev',
        label: 'ic-left--xs',
        disabled: isFirst,
        isNavigation: true,
      },
      ...visiblePages,
      {
        key: '__next',
        value: '__next',
        label: 'ic-right--xs',
        disabled: isLast,
        isNavigation: true,
      },
      {
        key: '__last',
        value: '__last',
        label: 'ic-last--xs',
        disabled: isLast,
        isNavigation: true,
      },
    ];
  })();

  // change 처리
  const handleChange = (
    optionValue,
    optionKey,
    optionDisabled,
    isNavigation = false
  ) => {
    if (disabled || optionDisabled) return;

    if (isNavigation) {
      const currentIndex = normalizedOptions.findIndex(
        (option) => option.value === currentValue
      );

      const navigationMap = {
        __first: 0,
        __last: normalizedOptions.length - 1,
        __prev: Math.max(0, currentIndex - 1),
        __next: Math.min(normalizedOptions.length - 1, currentIndex + 1),
      };

      const newIndex = navigationMap[optionValue];
      const newOption = normalizedOptions[newIndex];

      if (newOption) {
        const syntheticEvent = {
          target: { name, value: newOption.value, key: newOption.key },
          currentTarget: { name, value: newOption.value, key: newOption.key },
        };
        safeOnNavigate({
          ...syntheticEvent,
          type: optionValue.replace('__', ''),
        });
        safeOnChange(syntheticEvent);
      }
    } else {
      const syntheticEvent = {
        target: { name, value: optionValue, key: optionKey },
        currentTarget: { name, value: optionValue, key: optionKey },
      };
      safeOnChange(syntheticEvent);
    }
  };

  // style 처리
  const className = `radio radio--${variant}${safeSize ? ` radio${safeSize}` : ''}${
    error ? ' radio--error' : ''
  }${disabled ? ' radio--disabled' : ''}`;

  return (
    <div className={className}>
      {label && (
        <label className="radio__label">
          {required && <span className="radio__required">*</span>}
          {label}
        </label>
      )}

      <div className="radio__container">
        {processedOptions.map((option) => {
          const radioId = `${radioGroupId}-${option.key}`;
          const isChecked = option.value === currentValue;
          const isDisabled = disabled || option.disabled || false;
          const isNavigation = option.isNavigation || false;
          const isEllipsis = option.isEllipsis || false;

          if (variant === 'radio') {
            // Radio variant
            if (isNavigation) return null;

            return (
              <div
                key={option.key}
                className={`radio__option${isChecked ? ' radio__option--checked' : ''}${
                  isDisabled ? ' radio__option--disabled' : ''
                }${showError ? ' radio__option--error' : ''}`}
              >
                <input
                  type="radio"
                  id={radioId}
                  name={name}
                  className="radio__input"
                  value={option.value}
                  checked={isChecked}
                  onChange={() =>
                    handleChange(option.value, option.key, option.disabled)
                  }
                  disabled={isDisabled}
                />
                <label className="radio__radio-label" htmlFor={radioId}>
                  {option.label}
                </label>
              </div>
            );
          } else {
            // Button variant
            return (
              <div
                key={option.key}
                className={`radio__button${isChecked && !isNavigation ? ' radio__button--checked' : ''}${
                  isDisabled ? ' radio__button--disabled' : ''
                }${showError && !isNavigation ? ' radio__button--error' : ''}${
                  isNavigation ? ' radio__button--nav' : ''
                }`}
                data-nav={
                  isNavigation ? option.value.replace('__', '') : undefined
                }
                data-ellipsis={isEllipsis ? 'true' : undefined}
                tabIndex={isDisabled || isEllipsis ? -1 : 0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isDisabled) {
                    handleChange(
                      option.value,
                      option.key,
                      option.disabled,
                      isNavigation
                    );
                  }
                }}
              >
                <input
                  type="radio"
                  id={radioId}
                  name={isNavigation ? `${name}-nav` : name}
                  value={option.value}
                  className="radio__button-input"
                  checked={isChecked && !isNavigation}
                  onChange={() => {}}
                  disabled={isDisabled}
                />
                <label className="radio__button-label" htmlFor={radioId}>
                  {isNavigation || isEllipsis ? (
                    <span className={option.label}></span>
                  ) : (
                    option.label
                  )}
                </label>
              </div>
            );
          }
        })}
      </div>

      {showError && showErrorMessage && (
        <div className="radio__error-message">{showErrorMessage}</div>
      )}
    </div>
  );
}
