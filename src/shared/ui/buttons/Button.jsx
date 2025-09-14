export default function Button({
  label = '',
  variant = 'primary',
  size = '',
  onClick = () => {},
  disabled = false,
  children,
}) {
  const className = `btn${size} ${variant}`;

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children ?? label}
    </button>
  );
}
