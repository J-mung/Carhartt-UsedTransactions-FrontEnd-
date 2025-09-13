export default function Button({
  label = '',
  variant = 'primary',
  onClick = () => {},
  disabled = false,
  children,
}) {
  const className = `btn ${variant}`;

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
