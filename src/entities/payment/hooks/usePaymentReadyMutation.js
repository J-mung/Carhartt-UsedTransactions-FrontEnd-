import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useMutation } from '@tanstack/react-query';

// POST /v1/order/${orderId}/payment/ready
export const usePaymentReadyMutation = () => {
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async ({ orderId, paymentMethod, amount }) => {
      // mock 데이터 사용 시
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          next_redirect_pc_url: `/payment/result?provider=${paymentMethod}&orderid=${orderId}&pg_token=pg123`,
        };
      }

      // 요청 Body
      const requestBody = {
        order_id: orderId,
        payment_method: paymentMethod,
        amount_of_payment: amount,
        approve_url: `https://localhost:5173/payment/result?provider=${paymentMethod}&orderid=${orderId}`,
        fail_url: `https://localhost:5173/payment/result?provider=${paymentMethod}&orderid=${orderId}`,
        cancel_url: `https://localhost:5173/payment/result?provider=${paymentMethod}&orderid=${orderId}`,
      };
      try {
        // 응답
        const response = await carHarttApi({
          method: 'POST',
          url: `/v1/order/${orderId}/payment/ready`,
          data: requestBody,
        });

        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};
