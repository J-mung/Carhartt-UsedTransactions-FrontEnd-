export default function IconButton({
  iconClass = 'ic-close', // SCSS에서 정의한 아이콘 클래스
  title,
  size = '',
  shape = 'square',
  variant = '', // 확장성을 위한 추가 클래스로 CSS 커스터마이징
  onClick, // React 컨벤션에 맞춰 메서드 주입
  disabled = false,
}) {
  // 허용 tone, variant 값 세트
  const TONES = ['standard'];
  const VARIANTS = ['primary', 'secondary'];
  const ALLOWED_VARIANTS = TONES.flatMap((tone) =>
    VARIANTS.map((variant) => `${tone}-${variant}`)
  );
  const SIZES = ['--s', '', '--m', '--l'];
  const SHAPES = ['square', 'circle'];

  // variant 안전 처리 (fallback 적용)
  const safeVariant = ALLOWED_VARIANTS.includes(variant)
    ? variant
    : 'standard-primary';
  const safeSize = SIZES.includes(size) ? size : '';
  const safeShape = SHAPES.includes(shape) ? shape : 'square';
  const buttonClassName = `btn__ic${safeSize} ${safeVariant} ${safeShape}`;
  // 함수 안전 처리
  const safeOnClick = typeof onClick === 'function' ? onClick : () => {};
  return (
    <button
      type={'button'}
      onClick={safeOnClick}
      title={title}
      className={buttonClassName}
      disabled={disabled}
    >
      <span className={iconClass}></span>
    </button>
  );
}
