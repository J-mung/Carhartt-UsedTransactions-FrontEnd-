import { carHarttApi } from '@/shared/api/axios';
import { Button } from '@/shared/ui/buttons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginForm.scss';

export default function LoginForm() {
  const [kakaoLogin, setKakaoLogin] = useState('');
  const [naverLogin, setNaverLogin] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carHarttApi({
      method: 'GET',
      url: 'v1/oauth/login',
    })
      .then((response) => {
        const { data, meta } = response;
        if (data) {
          data.map((_provider) => {
            console.log('provider: ' + _provider.provider);
            if (_provider.provider === 'KAKAO')
              setKakaoLogin(_provider.authorize_url);
            if (_provider.provider === 'NAVER')
              setNaverLogin(_provider.authorize_url);
          });
        }
      })
      .catch((err) => {
        console.log('OAuth URL fetch error', err);
      });
  }, []);

  const onKakaoLogin = () => {
    if (!kakaoLogin) {
      alert('카카오 로그인 URL을 불러오지 못했습니다.');
      return;
    }

    // 카카오 authorize_url로 이동
    window.location.href = kakaoLogin;
  };

  return (
    <div className={'login'}>
      <div className={'login__form'}>
        <span className={'login__form__label h2'}>로그인 화면 입니다.</span>
        <div className={'login__form__buttons'}>
          <div className={`btn`} onClick={onKakaoLogin}>
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
