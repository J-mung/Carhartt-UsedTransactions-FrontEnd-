import { IconButton } from '@/shared/ui/icon_button';
export default function SearchButton({
  variant,
  onSearch = () => {
    alert('외부 주입 메서드');
  },
  disabled = false,
}) {
  const safeFunc = (func) => (typeof func === 'function' ? func : () => {});
  return (
    <IconButton
      iconClass={'ic-search'}
      onClick={safeFunc(onSearch)}
      title={'검색'}
      className={variant}
      disabled={disabled}
    />
  );
}
