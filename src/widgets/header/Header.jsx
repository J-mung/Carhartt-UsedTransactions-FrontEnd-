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
  // const isLogined = sessionStorage.getItem('oauth_state') === 'Authorized';
  // 쿠키에서 session id get
  const getJSessionId = () => {
    var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
    if (jsId != null) {
      if (jsId instanceof Array) jsId = jsId[0].substring(11);
      else jsId = jsId.substring(11);
    }
    return jsId;
  };

  const isLogined = getJSessionId();

  const rightBtnGroup = [
    {
      label: '판매하기',
      variant: 'standard-link',
      onClick: () => {
        alert('판매하기 버튼 클릭');
      },
      disabled: false,
    },
    {
      label: '관리',
      variant: 'standard-link',
      onClick: () => {
        alert('관리 버튼 클릭');
      },
      disabled: false,
      children: (
        <>
          <span className={'ic-user'}></span>
          <span className={'btn__label text-regular'}>관리</span>
        </>
      ),
    },
    {
      label: '채팅',
      variant: 'standard-link',
      onClick: () => {
        alert('채팅 버튼 클릭');
      },
      disabled: true,
    },
    {
      label: isLogined ? '로그아웃' : '로그인',
      variant: 'standard-primary',
      onClick: isLogined ? handleLogOut : handleLogin,
      disabled: false,
    },
  ];
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
        {/* <Button
          label={'판매하기'}
          onClick={() => alert('판매하기 버튼 클릭')}
        ></Button>
        <Button label={'관리'} onClick={() => alert('관리 버튼 클릭')}></Button>
        <Button
          label={'채팅'}
          onClick={() => alert('채팅 버튼 클릭')}
          disabled={true}
        ></Button>
        {isLogined ? (
          <Button label={'로그아웃'} onClick={handleLogOut}></Button>
        ) : (
          <Button label={'로그인'} onClick={handleLogin}></Button>
        )} */}
        {rightBtnGroup.map((_btn) => {
          return (
            <Button
              label={_btn.label}
              variant={_btn.variant}
              onClick={_btn.onClick}
              disabled={_btn.disabled}
            >
              {_btn.children ? _btn.children : ''}
            </Button>
          );
        })}
        {/* <ThemeToggle /> */}
      </div>
    </>
  );
}
