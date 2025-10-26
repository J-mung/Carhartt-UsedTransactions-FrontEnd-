import { useLoginStatus } from '@/entities/user/hook/useLoginStatus';
import ApiError from '@/shared/api/ApiError';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginCallback() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { data: userInfo, isLoading, isError, error } = useLoginStatus();

  const handleOpenModal = (message) => {
    openModal(Modal, {
      title: '로그인',
      children: <span className={'text-regular'}>{message}</span>,
    });
  };

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        return;
      }, 1000);
    }

    // 로그인 성공
    if (userInfo) {
      sessionStorage.setItem('user_info', JSON.stringify(userInfo));
      navigate('/');
      return;
    }

    // 비로그인 상태 (C001, C008 등)
    if (!userInfo && !isError) {
      openModal(Modal, {
        title: '로그인 필요',
        children: (
          <span className={'text-regular'}>
            세션이 만료되었습니다. 다시 로그인해주세요.
          </span>
        ),
      });
      navigate('/login');
      return;
    }

    // 기타 오류 처리
    if (isError) {
      const message =
        error instanceof ApiError
          ? `${error.code} - ${error.message}`
          : '로그인 상태 확인 중 알 수 없는 오류가 발생했습니다.';

      openModal(Modal, {
        title: '로그인 실패',
        children: <span children={'text-regular'}>{message}</span>,
      });

      navigate('/login?error=oauth_failed');
    }
  }, [isLoading, userInfo, isError, error, navigate, openModal]);

  return <div>로그인 처리 중...</div>;
}
