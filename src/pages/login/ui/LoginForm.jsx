import kakaoLoginImage from '@/app/assets/images/kakao/login_ko/kakao_login_medium_wide.png';
import { carHarttApi } from '@/shared/api/axios';
import { useMockConfig } from '@/shared/config/mockConfig.jsx';
import { Button } from '@/shared/ui/buttons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginForm.scss';

const mockOAuthProviders = [
  {
    provider: 'KAKAO',
    authorize_url: '/login/callback?mock=1',
  },
  {
    provider: 'NAVER',
    authorize_url: '',
  },
];

export default function LoginForm() {
  const [kakaoLogin, setKakaoLogin] = useState('');
  const [naverLogin, setNaverLogin] = useState('');
  const navigate = useNavigate();
  const { isMockConfig: isMockConfigFromContext } = useMockConfig();
  const mockDataMode = Boolean(isMockConfigFromContext);

  useEffect(() => {
    let isMounted = true;

    const applyProviders = (providers = []) => {
      if (!isMounted || !providers.length) return;

      providers.forEach((_provider) => {
        if (_provider.provider === 'KAKAO') {
          setKakaoLogin(_provider.authorize_url || '');
        }
        if (_provider.provider === 'NAVER') {
          setNaverLogin(_provider.authorize_url || '');
        }
      });
    };

    setKakaoLogin('');
    setNaverLogin('');

    if (mockDataMode) {
      applyProviders(mockOAuthProviders);
      return () => {
        isMounted = false;
      };
    }

    carHarttApi({
      method: 'GET',
      url: '/v1/oauth/login',
    })
      .then((response) => {
        const { data } = response;
        if (data) {
          applyProviders(data);
        }
      })
      .catch((err) => {
        console.log('OAuth URL fetch error', err);
      });

    return () => {
      isMounted = false;
    };
  }, [mockDataMode]);

  const onKakaoLogin = () => {
    if (!kakaoLogin) {
      alert('카카오 로그인 URL을 불러오지 못했습니다.');
      return;
    }

    if (mockDataMode) {
      navigate('/login/callback');
      return;
    }

    carHarttApi({
      method: 'GET',
      url: '/v1/oauth/login/kakao',
    })
      .then((response) => {
        const authUrl = response.data.authorize_url;
        // 카카오 authorize_url로 이동
        window.location.href = authUrl;
      })
      .catch((err) => {
        alert(`kakao_url error : ${err}`);
        console.log(`kakao_url error : ${err}`);
      });
  };

  return (
    <div className={'login'}>
      <div className={'login__form'}>
        <span className={'login__form__label h2'}>로그인 화면 입니다.</span>
        <div className={'login__form__buttons'}>
          <div className={`btn`} onClick={onKakaoLogin}>
            <img src={kakaoLoginImage} alt={'카카오 로그인'} />
          </div>
          <Button label={'Naver 추가 예정'} disabled={true} />
        </div>
      </div>
    </div>
  );
}
