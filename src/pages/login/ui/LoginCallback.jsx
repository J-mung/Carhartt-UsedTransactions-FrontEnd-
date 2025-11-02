import { useUserStatus } from '@/entities/user/hooks/useUserStatus';
import ApiError from '@/shared/api/ApiError';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginCallback() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const {
    data: userInfo,
    status: loginCheckStatus,
    isError,
    error,
  } = useUserStatus();
  const handleRef = useRef(false);

  const handleOpenModal = ({ title, message }) => {
    openModal(Modal, {
      title: '로그인',
      children: <span className={'text-regular'}>{message}</span>,
    });
  };

  useEffect(() => {
    if (handleRef.current) return;
    if (loginCheckStatus === 'loding' || loginCheckStatus === 'idle') {
      setTimeout(() => {
        return;
      }, 1000);
    }

    // 로그인 성공
    if (loginCheckStatus === 'success' && userInfo) {
      handleRef.current = true;

      sessionStorage.setItem('user_info', JSON.stringify(userInfo));
      navigate('/', { replace: true });
      return;
    }

    // 비로그인 상태 (C001, C008 등)
    if (loginCheckStatus === 'success' && !userInfo) {
      // openModal(Modal, {
      //   title: '로그인 필요',
      //   children: (
      //     <span className={'text-regular'}>
      //       세션이 만료되었습니다. 다시 로그인해주세요.
      //     </span>
      //   ),
      // });
      handleRef.current = true;
      handleOpenModal({
        title: '로그인 필요',
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
      });
      navigate('/login', { replace: true });
      return;
    }

    // 기타 오류 처리
    if (loginCheckStatus === 'error') {
      handleRef.current = true;
      const message =
        error instanceof ApiError
          ? `${error.code} - ${error.message}`
          : '로그인 상태 확인 중 알 수 없는 오류가 발생했습니다.';

      // openModal(Modal, {
      //   title: '로그인 실패',
      //   children: <span children={'text-regular'}>{message}</span>,
      // });
      handleOpenModal({
        title: '로그인 실패',
        message: message,
      });

      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [loginCheckStatus, userInfo, error, navigate, openModal]);

  return <div>로그인 처리 중...</div>;
}
