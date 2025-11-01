import { carHarttApi } from '@/shared/api/axios';
import { useMutation } from '@tanstack/react-query';

export const useOrderMutation = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await carHarttApi({
        method: 'POST',
        url: '/v1/order',
        data: payload,
      });

      return response.data;
    },
  });
};
