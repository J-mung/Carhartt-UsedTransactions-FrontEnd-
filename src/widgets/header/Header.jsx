import { useIsLoggedIn } from '@/entities/user/hooks/useIsLoggedIn';
import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import Button from '@/shared/ui/buttons/Button';
import IconTextButton from '@/shared/ui/buttons/IconTextButton';
import { useNavigate } from 'react-router-dom';
import Modal from '../modal/Modal';
import { useModal } from '../modal/ModalProvider';

/**
 * 공통 헤더
 * @returns
 */
export default function Header({ title }) {
  const { openModal } = useModal();
  // 로그인 상태 확인 (Boolean)
  const { isLoggedIn, isLoading } = useIsLoggedIn();
  const { useMock } = useMockToggle();
  const navigate = useNavigate();

  // 홈 화면 바로가기
  const handleHome = () => {
    navigate('/', { replace: true });
  };

  // 판매하기 화면 바로가기
  const handleSellPage = () => {
    isLoggedIn
      ? navigate('/product/new', { replace: true })
      : openModal(Modal, {
          title: '로그인 필요',
          children: (
            <span className={'text-regular'}> 로그인이 필요합니다.</span>
          ),
          onClose: handleLogin,
        });
  };

  // 관리(마이페이지) 화면 바로가기
  const handleMyPage = () => {
    isLoggedIn
      ? navigate('/mypage')
      : openModal(Modal, {
          title: '로그인 필요',
          children: (
            <span className={'text-regular'}>로그인이 필요합니다.</span>
          ),
          onClose: handleLogin,
        });
  };

  // 로그인 핸들러
  const handleLogin = () => {
    navigate('/login', { replace: true });
  };

  // 로그아웃 핸들러
  const handleLogOut = () => {
    if (useMock) {
      sessionStorage.removeItem('user_info');
      sessionStorage.removeItem('is_logged_in');
      window.location.href = '/';
    }

    const { loginType, provider } = JSON.parse(
      sessionStorage.getItem('user_info') || '{}'
    );

    carHarttApi({
      method: 'POST',
      url: '/v1/oauth/logout',
      data: {
        type: loginType,
        provider: provider,
      },
    })
      .then((response) => {
        if (response && response.status) {
          sessionStorage.removeItem('user_info');
          sessionStorage.removeItem('is_logged_in');
          window.location.href = '/';
        }
      })
      .catch((error) => {
        openModal(Modal, {
          title: '로그아웃 실패',
          children: (
            <span className={'text-regular'}>{`에러 발생 : ${error}`}</span>
          ),
        });
      });
  };

  return (
    <>
      <Button
        label={title}
        variant={'standard-link'}
        onClick={handleHome}
      ></Button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2px',
        }}
      >
        <Button
          label={'판매하기'}
          variant={'standard-link'}
          // onClick={() => navigate(isLoggedIn ? '/product/new' : '/login')}
          onClick={handleSellPage}
          disabled={false}
        ></Button>
        <IconTextButton
          label={'관리'}
          variant={'standard-link'}
          onClick={handleMyPage}
          disabled={false}
        >
          <span className={'ic-user'}></span>
          <span className={'btn__label text-regular'}>관리</span>
        </IconTextButton>
        <Button
          label={'채팅'}
          variant={'standard-link'}
          onClick={() => alert('채팅 버튼 클릭')}
          disabled={true}
        ></Button>
        {isLoggedIn ? (
          <Button label={'로그아웃'} onClick={handleLogOut}></Button>
        ) : (
          <Button label={'로그인'} onClick={handleLogin}></Button>
        )}
        {/* <ThemeToggle /> */}
      </div>
    </>
  );
}
