export default function Button({
  label = '',
  variant = 'primary',
  onClickHandler = () => {},
  disabled = false,
  children,
}) {
  const className = `button btn--${variant}`;

  return (
    <button
      type="button"
      className={className}
      onClick={onClickHandler}
      aria-label={label}
      disabled={disabled}
      data-class={variant}
    >
      {children ?? label}
    </button>
  );
}
