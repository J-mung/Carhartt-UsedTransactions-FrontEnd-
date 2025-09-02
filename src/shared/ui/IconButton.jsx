export default function IconButton({
  iconClass = 'ic-close', // SCSS에서 정의한 아이콘 클래스
  onClick, // React 컨벤션에 맞춤
  title,
  shape = 'circle', // 아이콘 모양 circle / square
  className = '', // 확장성을 위한 추가 클래스 (추후 제거될 수 있음)
  type = 'button', // form 안전성
  disabled = false,
}) {
  return (
    <button type={type} onClick={onClick} title={title} className={`btn__ic ${shape} ${className}`} disabled={disabled}>
      <span className={iconClass}></span>
    </button>
  );
}
