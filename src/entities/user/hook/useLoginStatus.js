import { carHarttApi } from '@/shared/api/axios';
import { useQuery } from '@tanstack/react-query';

export function useLoginStatus() {
  return useQuery({
    queryKey: ['loginStatus'],
    queryFn: async () => {
      const res = await carHarttApi({
        method: 'GET',
        url: '/oauth/login/check',
      })
        .then((response) => {
          if (respnose && response.data) {
            // 로그인 성공 및 사용자 정보 반환
            return response.data;
          }

          // 응답은 정상이나 data 없음
          return null;
        })
        .catch((error) => {
          if (error instanceof ApiError) {
            const code = error.code || '';

            // 세션 만료 or 미인증 (C001)
            if (code === 'C001') {
              return null;
            }

            // CSRF 오류 (C008) 재로그인 필요
            if (code === 'C008') {
              console.warn('CSRF 토큰 불일치: 재로그인 필요');
              return null;
            }

            // 내부 처리 오류 (C010)
            if (code === 'C010') {
              console.error(`서버 내부 오류: ${error.message}`);
              throw error; // 내부 오류는 그대로 상위 throw
            }

            // 나머지 오류 (C002, C003, 등)
            throw error;
          }

          // 예기치 못한 네트워크 또는 Axios 에러
          throw new ApiError('Unexpected error', {
            code: 'UNKNOWN',
            message:
              error?.message ||
              '로그인 상태 확인 중 알 수 없는 오류가 발생했습니다.',
          });
        });
    },
    retry: false, // 인증 실패 재시도 미진행
    staleTime: 1000 * 60 * 3,
  });
}
