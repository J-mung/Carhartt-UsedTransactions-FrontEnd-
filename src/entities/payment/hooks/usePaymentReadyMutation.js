import { carHarttApi } from '@/shared/api/axios';
import { useMutation } from '@tanstack/react-query';

export const usePaymentReadyMutation = () => {
  return useMutation({
    mutationFn: async ({ orderId, paymentMethod, amount }) => {
      const requestBody = {
        order_id: orderId,
        payment_method: paymentMethod,
        amount_of_payment: amount,
        approve_url: 'https://localhost:5173/payment/1101/result',
        fail_url: 'https://localhost:5173/payment/1101/result',
        cancel_url: 'https://localhost:5173/payment/1101/result',
      };
      const response = await carHarttApi({
        method: 'POST',
        url: `/v1/order/${orderId}/payment/ready`,
        data: requestBody,
      });

      return response.data;
    },
  });
};
