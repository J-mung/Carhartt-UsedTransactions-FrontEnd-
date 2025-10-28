import { carHarttApi } from '@/shared/api/axios';
import { useQuery } from '@tanstack/react-query';

const mockAddresses = [
  {
    key: '101',
    value: '주소1',
    alias: '집',
    label: '집: 주소1',
  },
  {
    key: '102',
    value: '주소2',
    alias: '본가',
    label: '본가: 주소2',
  },
];

const USE_MOCK_DATA = true;

export function useAddressesQuery(userId) {
  console.log('[useAddressesQuery] called with userId:', userId);

  return useQuery({
    queryKey: ['addresses', userId],
    queryFn: async () => {
      console.log('[useAddressesQuery] queryFn called', {
        USE_MOCK_DATA,
        userId,
      });
      // Mock data
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return mockAddresses;
      }

      // API 요청
      try {
        const response = await carHarttApi({
          method: 'GET',
          url: `/v1/orders/address?member_id=${userId}`,
          responseType: 'application/json',
        });

        return response.data; // 데이터 반환
      } catch (error) {
        console.error(`주소지 목록 조회 API 에러 : ${error}`);
        throw error;
      }
    },
  });
}
