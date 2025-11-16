import { carHarttApi } from '@/shared/api/axios';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { BASE_PATH } from './constants';

/**
 * presigned URL 발급 → S3 업로드 → 서버 반영까지 담당
 * React Query 기반 API 처리 훅
 */
export function useUploadProfileImage() {
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  /**
   * Presigned URL 요청
   */
  const presignedUrlMutation = useMutation({
    mutationFn: async (file) => {
      const body = {
        originalFileName: file.name,
        fileSize: file.size,
        extension: file.name.split('.').pop(),
      };

      const response = await carHarttApi({
        method: 'POST',
        url: '/v1/myPage/profile/presigned-url',
        data: body,
      });
      return response.data;
    },
  });

  /**
   * 프로필 이미지 갱신
   */
  const updateProfileImageMutation = useMutation({
    mutationFn: async (filePath) => {
      const response = await carHarttApi({
        method: 'PUT',
        url: '/v1/myPage/profile/image',
        data: {
          profileImageUrl: filePath,
        },
      });
      return response.data;
    },
  });

  /**
   * S3 업로드
   * @param {*} file 업로드 파일
   * @param {*} preSignedUrl 서명 완료된 S3 업로드 URL
   */
  const uploadToS3 = async (file, preSignedUrl) => {
    // S3 업로드는 인증, 쿠키가 필요 없는 순수 HTTP 요청이라 fetch 사용
    // axios 사용 시 전역 설정이 자동으로 정의 돼 CORS 에러 유발될 수 있음
    const response = await fetch(preSignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to S3');
    }

    return response;
  };

  /**
   * 상대 경로로 S3 절대 경로를 생성
   * @param {*} filePath
   * @returns
   */
  const buildFullFilePath = (filePath) => {
    return `${BASE_PATH}/${filePath}`;
  };

  const uploadProfileImage = useCallback(
    async (items) => {
      if (!items || items.length === 0) {
        openModal(Modal, {
          title: '업로드 실패',
          children: (
            <span className={'text-regular'}>
              업로드할 이미지를 먼저 선택해주세요.
            </span>
          ),
        });
        return false;
      }

      const overSizeList = items.filter((_item) => _item.overSize);
      if (overSizeList.length > 0) {
        openModal(Modal, {
          title: '업로드 실패',
          children: (
            <span className={'text-regular'}>
              용량 초과 파일이 포함되어 있습니다. (최대 5MB)
            </span>
          ),
        });
        return false;
      }

      try {
        for (const item of items) {
          // presigned URL 생성
          const presignedResponse = await presignedUrlMutation.mutateAsync(
            item.file
          );
          const presignedData = presignedResponse;
          const { preSignedUrl, filePath } = presignedData ?? {};

          if (!preSignedUrl || !filePath) {
            throw new Error('Presigned URL 생성 실패');
          }

          // S3 업로드
          const uploadToS3Result = await uploadToS3(item.file, preSignedUrl);
          console.log('S3 업로드 성공: ', filePath);

          // 서버에 이미지 반영
          const updateResponse =
            await updateProfileImageMutation.mutateAsync(filePath);

          const isSuccess =
            updateResponse && typeof updateResponse === 'object'
              ? (updateResponse.success ?? true)
              : true;

          if (!isSuccess) {
            throw new Error('프로필 변경 실패');
          }

          // loginStatus 캐시 갱신
          queryClient.setQueryData(['loginStatus'], (prev) => {
            if (!prev) return prev;
            return { ...prev, avatar: buildFullFilePath(filePath) };
          });

          openModal(Modal, {
            title: '프로필 변경 완료',
            children: (
              <span className={'text-regular'}>
                프로필 이미지 변경을 완료 했습니다.
              </span>
            ),
          });
        }

        return true;
      } catch (error) {
        console.error('업로드 실패: ', error);
        openModal(Modal, {
          title: '업로드 오류',
          children: (
            <span className={'text-regular'}>
              이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.
            </span>
          ),
        });
        return false;
      }
    },
    [presignedUrlMutation, updateProfileImageMutation, queryClient, openModal]
  );

  return {
    uploadProfileImage,
    isUploading:
      presignedUrlMutation.isLoading || updateProfileImageMutation.isLoading,
  };
}
