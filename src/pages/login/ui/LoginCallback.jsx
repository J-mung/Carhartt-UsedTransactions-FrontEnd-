import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const sessionId = params.get('sessionId');

    if (success === 'true' && sessionId) {
      sessionStorage.setItem('SESSION_ID', sessionId);
      navigate('/');
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}
