export default function IconButton({
  iconClass = 'ic-close', // SCSS에서 정의한 아이콘 클래스
  onClick, // React 컨벤션에 맞춰 메서드 주입
  title,
  className = '', // 확장성을 위한 추가 클래스로 CSS 커스터마이징
  type = 'button', // form 안전성
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      className={`btn__ic ${className}`}
      disabled={disabled}
    >
      <span className={iconClass}></span>
    </button>
  );
}
