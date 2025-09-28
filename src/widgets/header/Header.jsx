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
  // TODO 결제 시나리오 테스트를 위해 추가 했으므로 추후 삭제
  const handlePayment = () => {
    if (!isLogined) {
      alert('로그인 필요');
      navigate('/login', { replace: true });
    }
    navigate('/payment', { replace: true });
  };

  return (
    <>
      <Button
        label={title}
        variant={'standard-link'}
        onClick={handleHome}
      ></Button>
      {isLogined ? (
        <div>
          <Button label={'구매하기'} onClick={handlePayment}></Button>
          <Button label={'로그아웃'} onClick={handleLogOut}></Button>
        </div>
      ) : (
        <Button label={'로그인'} onClick={handleLogin}></Button>
      )}

      {/* <ThemeToggle /> */}
    </>
  );
}
