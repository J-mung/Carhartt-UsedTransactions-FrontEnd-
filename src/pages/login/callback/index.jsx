import { carHarttApi } from '@/shared/api/axios';
import { useNavigate } from 'react-router-dom';

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');
    const state = query.get('state');
    const savedState = sessionStorage.getItem('user_info');

    if (!code || !state || state !== savedState) {
      // state 불일치
      NavigationActivation('/login?error=state_mismatch');
      return;
    }

    const provider = 'kakao';

    carHarttApi({
      method: 'POST',
      url: '/v1/auth/callback/kakao',
      credentials: 'include', // 서버 세션/쿠키 수신
      body: JSON.stringify({ provider, code, state }),
    })
      .then((response) => {
        console.log('response: ', response);
      })
      .catch((error) => {
        console.error('error: ', error);
      });
  }, [navigate]);

  return null;
}
