import { carHarttApi } from '@/shared/api/axios';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginCallback() {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleOpenModal = (message) => {
    openModal(Modal, {
      title: '로그인',
      children: <span className={'text-regular'}>{message}</span>,
    });
  };

  useEffect(() => {
    // 서버에 로그인 상태 확인 요청 (쿠키 자동 전송)
    carHarttApi({
      method: 'GET',
      url: 'v1/oauth/login/check',
    })
      .then((response) => {
        const { status, data, error, meta } = response;
        if (status === 200 && !!data) {
          sessionStorage.setItem('user_info', data);
          navigate('/');
        } else {
          handleOpenModal('로그인에 실패했습니다. 다시 시도해 주세요.');
          navigate('/login?error=oauth_failed');
        }
      })
      .catch((error) => {
        handleOpenModal(`로그인 상태 확인 중 오류가 발생했습니다.\n${error}`);
        navigate('/login?error=oauth_failed');
      });
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}
