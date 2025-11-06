import { carHarttApi } from '@/shared/api/axios';
import { useQuery } from '@tanstack/react-query';

const mockWishList = [
  {
    id: 'wish-1',
    title: '트레드 밀 비니',
    price: '32,000원',
    status: '가격 인하',
    statusType: 'notice',
    description: '찜한 후 2일 경과 · 5,000원 인하',
  },
  {
    id: 'wish-2',
    title: 'Kendrick Cap',
    price: '46,000원',
    status: '판매중',
    statusType: 'ongoing',
    description: '남은 수량 1개',
  },
  {
    id: 'wish-3',
    title: 'Hooded Sail Jacket',
    price: '165,000원',
    status: '재입고 알림',
    statusType: 'notice',
    description: '입고 예정 · 3일 전 안내',
  },
  {
    id: 'wish-4',
    title: 'Simple Pant',
    price: '85,000원',
    status: '판매중',
    statusType: 'ongoing',
    description: '사이즈 30 · 새상품 급',
  },
  {
    id: 'wish-5',
    title: 'Jake Hip Bag',
    price: '58,000원',
    status: '가격 인하',
    statusType: 'notice',
    description: '10% 할인 진행 중',
  },
];

// GET /v1/wishes
export function useWishList() {
  const USE_MOCK_DATA = false;

  return useQuery({
    queryKey: ['wishList'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return mockWishList;
      }

      const response = await carHarttApi({
        method: 'GET',
        url: '/v1/wishes',
        withCredentials: true,
      });

      return response.data || [];
    },
  });
}
