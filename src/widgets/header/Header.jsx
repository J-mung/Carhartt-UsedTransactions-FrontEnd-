import ThemeToggle from '@/shared/ui/ThemeToggle';
import Button from '@/shared/ui/buttons/Button';
import { useNavigate } from 'react-router-dom';

/**
 * 공통 헤더
 * @returns
 */
export default function Header({ title }) {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate('/', { replace: true });
  };
  const handleLogin = () => {
    navigate('/login', { replace: true });
  };
  const handleLogOut = () => {
    sessionStorage.removeItem('oauth_state');
    navigate('/');
  };
  const isLogined = sessionStorage.getItem('oauth_state') === 'Authorized';
  return (
    <>
      <Button
        label={title}
        variant={'standard-link'}
        onClick={handleHome}
      ></Button>
      {isLogined ? (
        <Button label={'로그아웃'} onClick={handleLogOut}></Button>
      ) : (
        <Button label={'로그인'} onClick={handleLogin}></Button>
      )}

      <ThemeToggle />
    </>
  );
}
