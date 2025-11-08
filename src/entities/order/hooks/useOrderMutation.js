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
        await new Promise((resolve) => setTimeout(resolve, 2000));
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
        throw error;
      }
    },
  });
};
