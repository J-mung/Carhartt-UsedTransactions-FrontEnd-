export default function Button({
  label = '',
  variant = 'primary',
  size = '',
  onClick,
  disabled = false,
  children,
}) {
  // 허용 tone, variant, size, font 값 세트
  const TONES = ['standard', 'danger', 'ghost'];
  const VARIANTS = ['primary', 'secondary', 'link'];
  const ALLOWED_VARIANTS = TONES.flatMap((tone) =>
    VARIANTS.map((variant) => `${tone}-${variant}`)
  );
  const SIZES = ['--s', '', '--m', '--l'];
  const FONTS = {
    '--l': 'h5-regular',
    '--m': 'text-regular',
    '--s': 'text-regular',
    default: 'text-regular',
  };

  // variant, size, font 안전 처리 (fallback 적용)
  const safeVariant = ALLOWED_VARIANTS.includes(variant)
    ? variant
    : 'standard-primary';
  const safeSize = SIZES.includes(size) ? size : '';
  const safeFont = FONTS[safeSize] || FONTS.default;

  // style 처리
  const buttonClassName = `btn${safeSize} ${safeVariant}`;
  const labelClassName = `btn__label ${safeFont}`;

  // 함수 안전 처리
  const safeOnClick = typeof onClick === 'function' ? onClick : () => {};

  // 라벨 안전 처리
  const renderLabel = () => {
    if (children) return children;
    if (label) return <span className={labelClassName}>{label}</span>;
    return <span className={labelClassName}>fall back</span>;
  };

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={safeOnClick}
      {...(disabled && { disabled: true })}
    >
      {renderLabel()}
    </button>
  );
}
