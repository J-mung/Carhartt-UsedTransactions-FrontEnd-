export default function Button({
  label = '',
  variant = 'primary',
  size = '--m',
  onClick,
  disabled = false,
  children,
}) {
  // 허용 variant, size 값 세트
  const VARIANTS = [
    'standard-primary',
    'standard-secondary',
    'standard-link',
    'danger-primary',
    'danger-secondary',
    'danger-link',
  ];
  const SIZES = ['--xs', '--s', '', '--m', '--l'];

  // variant / size 안전 처리 (fallback 적용)
  const safeVariant = VARIANTS.includes(variant) ? variant : 'standard-primary';
  const safeSize = SIZES.includes(size) ? size : '--m';

  // 함수 안전 처리
  const safeOnClick = typeof onClick === 'function' ? onClick : () => {};

  const className = `btn${safeSize} ${safeVariant}`;

  return (
    <button
      type="button"
      className={className}
      onClick={safeOnClick}
      disabled={disabled}
    >
      {children ?? <span className="btn__label">{label}</span>}
    </button>
  );
}
