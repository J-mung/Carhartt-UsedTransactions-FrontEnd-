export default function Tab({
  tab,
  index,
  isActive,
  isFocused,
  onClick,
  onKeyDown,
  tabRef,
}) {
  return (
    <div
      ref={tabRef}
      className={`tab-group__tab ${isActive ? 'active text-strong' : ''} ${
        tab.disabled ? 'disabled' : ''
      } text-regular`}
      role="tab"
      tabIndex={isFocused && !tab.disabled ? 0 : -1}
      aria-selected={isActive}
      aria-disabled={tab.disabled || false}
      onClick={!tab.disabled ? onClick : undefined}
      onKeyDown={!tab.disabled ? (e) => onKeyDown(e, index) : undefined}
    >
      {tab.label}
    </div>
  );
}
