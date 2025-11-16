import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useMutation } from '@tanstack/react-query';

// POST /v1/order
export const useOrderMutation = () => {
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async (payload) => {
      // mock 데이터 사용 시
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { order_id: 1 };
      }

      try {
        // 응답
        const response = await carHarttApi({
          method: 'POST',
          url: '/v1/order',
          data: payload,
        });

        return response.data;
      } catch (error) {
        const { code, message } = error || {};

        // 명시된 코드가 있을 경우 그대로 throw
        if (['004', '005', '006', '008'].includes(code)) {
          throw { code, message };
        }

        // 그 외의 경우
        throw {
          code: code || 'UNKNOWN',
          message:
            '확인되지 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        };
      }
    },
  });
};
