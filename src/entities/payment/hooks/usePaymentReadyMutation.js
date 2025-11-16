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
          next_redirect_pc_url: `/payment/result?provider=${paymentMethod}&order_id=${orderId}&pg_token=pg123`,
        };
      }

      // 요청 Body
      const requestBody = {
        order_id: orderId,
        payment_method: paymentMethod,
        amount_of_payment: amount,
        approve_url: `https://carhartt-local.com:5173/payment/result?provider=${paymentMethod}&order_id=${orderId}`,
        fail_url: `https://carhartt-local.com:5173/payment/result?provider=${paymentMethod}&order_id=${orderId}`,
        cancel_url: `https://carhartt-local.com:5173/payment/result?provider=${paymentMethod}&order_id=${orderId}`,
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
        const { code, message } = error;

        // 명시된 코드일 경우 그대로 throw
        if (['001', '002', '003', '004', '005', '006', '007'].includes(code)) {
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
