export default function TextArea({
  label = '',
  name = '',
  placeholder = '',
  value = '',
  onChange = () => {},
  size = '',
  maxLength,
  disabled = false,
  required = false,
  error = false,
  errorMessage = '',
}) {
  // 허용 size 값 세트 & 안전 처리
  const SIZES = ['--s', '', '--l'];
  const safeSize = SIZES.includes(size) ? size : '';

  // 함수 안전 처리
  const safeOnChange = typeof onChange === 'function' ? onChange : () => {};

  // 에러 처리
  const currentLength = value ? value.length : 0;
  const isOverLimit = maxLength && currentLength > maxLength;
  const hasError = error || isOverLimit;
  const limitErrorMessage = isOverLimit
    ? `최대 ${maxLength}자까지 입력 가능합니다`
    : '';
  const displayErrorMessage = errorMessage || limitErrorMessage;

  const className = `textarea${
    safeSize ? ` textarea${safeSize}` : ''
  }${hasError ? ' textarea--error' : ''}`;

  return (
    <div className={className}>
      {label && (
        <label className="textarea__label" htmlFor={name}>
          {required && <span className="textarea__required">*</span>}
          {label}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        className="textarea__input"
        placeholder={placeholder}
        value={value}
        onChange={safeOnChange}
        maxLength={maxLength}
        aria-label={label}
        disabled={disabled}
        required={required}
      />

      <div className="textarea__bottom">
        {hasError && displayErrorMessage && (
          <div className="textarea__error-message">{displayErrorMessage}</div>
        )}

        {maxLength && (
          <div
            className={`textarea__counter ${
              isOverLimit ? 'textarea__counter--over' : ''
            }`}
          >
            {currentLength}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
}
