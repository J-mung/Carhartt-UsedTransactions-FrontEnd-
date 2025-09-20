import { carHarttApi } from '@/shared/api/axios';
import { Button } from '@/shared/ui/buttons';
import './loginForm.scss';

export default function LoginForm() {
  const onKakaoLogin = () => {
    alert('kakao login 요청');
    carHarttApi({
      method: 'GET',
      url: '/v1/auth/login/kakao',
      withCredentials: true,
    })
      .then((response) => {
        const { data, meta, status, headers } = response;
        const { authorizeUrl, state } = data.json();
        sessionStorage.setItem('oauth_state', state);
        window.location.assign(authorizeUrl);
      })
      .catch((error) => {
        console.error('Fail login via Kakao');
      });
  };

  return (
    <div className={'login'}>
      <div className={'login__form'}>
        <span className={'login__form__label h2'}>로그인 화면 입니다.</span>
        <div className={'login__form__buttons'}>
          <div className={'btn'} onClick={onKakaoLogin}>
            <img
              src={
                'src/app/assets/images/kakao/login_ko/kakao_login_medium_wide.png'
              }
            />
          </div>
          <Button label={'Naver 추가 예정'} disabled={true} />
        </div>
      </div>
    </div>
  );
}
