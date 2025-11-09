// /v1/order/payment/approve

import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useMutation } from '@tanstack/react-query';

// {provider: KAKAOPAY / NAVERPAY, pgToken: String}
export const usePaymentApproveMutation = () => {
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async ({ provider, orderId, pgToken }) => {
      // mock 데이터 사용 시
      if (!useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { order_id: 1 }; // 테스트 목적으로 order_id를 파라미터로 받아 와야 하나
      }

      // 요청 Body
      const requestBody = {
        provider: provider,
        pgToken: pgToken,
      };

      try {
        // 응답
        const response = await carHarttApi({
          method: 'POST',
          url: `/v1/order/payment/approve?orderId=${orderId}`,
          data: requestBody,
        });

        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};
