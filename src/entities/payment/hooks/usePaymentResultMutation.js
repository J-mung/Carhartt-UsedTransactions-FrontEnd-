import AlternativeImage from '@/app/assets/images/AlternativeImage.jpg';
import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useMutation } from '@tanstack/react-query';

// GET /v1/order/{orderId}/item
export const usePaymentResultMutation = () => {
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async ({ orderId }) => {
      // mock 데이터 사용 시
      if (!useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          itemId: 1,
          itemName: '근면성실한 샐러리',
          itemPrice: 95000,
          itemImg: AlternativeImage,
          addressDetail: '서울특별시 강남구 역삼동 ㅁㅁㅁ-ㅁㅁㅁ',
          orderDateTime: Date.now(),
        };
      }

      try {
        // 응답
        const response = await carHarttApi({
          method: 'GET',
          url: `/v1/order/${orderId}/item`,
        });

        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};
