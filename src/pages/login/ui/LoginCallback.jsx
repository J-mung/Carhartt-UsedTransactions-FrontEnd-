import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 서버에 로그인 상태 확인 요청 (쿠키 자동 전송)
    carHarttApi({
      method: 'GET',
      url: 'v1/oauth/login/check',
    })
      .then((response) => {
        const { data } = response;
        if (data.authenticated) {
          alert('로그인에 성공했습니다.');
          navigate('/');
        } else {
          alert('로그인에 실패했습니다.');
          navigate('/login?error=oauth_failed');
        }
      })
      .catch(() => {
        alert('로그인 상태 확인 중 오류가 발생했습니다.');
        navigate('/login?error=oauth_failed');
      });
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}
