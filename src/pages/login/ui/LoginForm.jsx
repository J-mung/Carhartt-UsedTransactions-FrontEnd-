import { Button } from '@/shared/ui/buttons';

export default function LoginForm() {
  const onKakaoLogin = () => {
    alert('kakao login 요청');
  };

  return (
    <div className={'login__form'}>
      <p>로그인 폼입니다.</p>
      {/* <div className={'btn'} onClick={onKakaoLogin}>
        <img
          src={
            'src/app/assets/images/kakao/login_ko/kakao_login_large_narrow.png'
          }
        />
      </div> */}
      <Button>
        <img
          src={
            'src/app/assets/images/kakao/login_ko/kakao_login_large_narrow.png'
          }
        />
      </Button>
    </div>
  );
}
