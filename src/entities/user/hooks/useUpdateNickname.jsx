import { carHarttApi } from '@/shared/api/axios';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// POST /v1/myPage/change_name
export function useUpdateNickname() {
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  return useMutation({
    // 닉네임 변경 API 요청
    mutationFn: async (newNickname) => {
      const response = await carHarttApi({
        method: 'POST',
        url: '/v1/myPage/change_nickname',
        data: {
          nickname: newNickname,
        },
      });
      return response;
    },
    // 닉네임 변경 성공 시 캐시된 사용자 정보 업데이트
    onSuccess: (response) => {
      const nickname = response.data.nickname;
      queryClient.setQueryData(['loginStatus'], (prev) =>
        prev ? { ...prev, memberNickname: nickname } : prev
      );

      openModal(Modal, {
        title: '닉네임 변경 완료',
        children: (
          <span className="text-regular">
            닉네임이 {nickname}(으)로 변경되었습니다.
          </span>
        ),
      });
    },
    // 실패 시 유효성 메시지 또는 일반 오류 처리
    onError: (error) => {
      const title = '닉네임 수정 실패';
      let content = (
        <span className={'text-regular'}>알 수 없는 오류가 발생했습니다.</span>
      );

      if (error instanceof ApiError) {
        const { code, message, details } = error;

        if (code === 'V001' && Array.isArray(details)) {
          // 입력 유효성 오류 (다중 메시지)
          const detailMessage = details.map((d) => d.message).join('\n');
          content = (
            <span className={'text-regular'}>
              {message}
              <br />
              {detailMessage}
            </span>
          );
        } else {
          // 그 외 오류
          content = (
            <span className={'text-regular'}>
              ({code ?? 'UNKNOWN'}) {message}
            </span>
          );
        }
      }

      openModal(Modal, {
        title,
        children: content,
      });
    },
  });
}
