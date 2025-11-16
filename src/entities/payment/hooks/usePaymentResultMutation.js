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
      if (useMock) {
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
        const { code, message } = error;

        if (['004', '005', '006'].includes(code)) {
          throw { code, message };
        }

        throw {
          code: code || 'UNKNOWN',
          message:
            '확인되지 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        };
      }
    },
  });
};
