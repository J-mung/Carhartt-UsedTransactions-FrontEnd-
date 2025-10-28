import {
  mockCategories,
  productData,
} from '@/pages/single-product/model/mockProductData';
import { carHarttApi } from '@/shared/api/axios'; // 커스텀 axios 인스턴스
import { useQuery } from '@tanstack/react-query';

const USE_MOCK_DATA = true;

// Fetch single product detail
export function useProductDetail(itemId) {
  return useQuery({
    queryKey: ['product', itemId],
    queryFn: async () => {
      // Mock data
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return productData;
      }

      // Real API
      const response = await carHarttApi({
        method: 'GET',
        url: `/v1/items/${itemId}`,
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!itemId,
  });
}

// Fetch categories - breadcrumb/카테고리 필터
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Mock data
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockCategories;
      }

      // Real API
      const response = await carHarttApi({
        method: 'GET',
        url: '/v1/categories',
        withCredentials: true,
      });
      return response.data;
    },
  });
}
