import ThemeToggle from '@/shared/ui/ThemeToggle';

/**
 * 공통 헤더
 * @returns
 */
export default function Header({ title }) {
  return (
    <>
      <strong>{title}</strong>
      <ThemeToggle />
    </>
  );
}
