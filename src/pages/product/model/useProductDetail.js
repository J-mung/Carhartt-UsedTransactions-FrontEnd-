import { useQuery } from '@tanstack/react-query';
import { carHarttApi } from '@/shared/api/axios';

/**
 * Fetch single product detail
 * @param {number} itemId - Product ID from URL params
 */
export function useProductDetail(itemId) {
  return useQuery({
    queryKey: ['product', itemId],
    queryFn: async () => {
      // Based on API doc - adjust URL
      const response = await carHarttApi({
        method: 'GET',
        url: `/v1/items/${itemId}`,
        withCredentials: true,
      });

      return response.data; // Returns the product data
    },
    enabled: !!itemId, // Only fetch if itemId exists
  });
}

/**
 * Fetch categories - for breadcrumb/category name
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await carHarttApi({
        method: 'GET',
        url: '/v1/categories',
        withCredentials: true,
      });
      return response.data;
    },
  });
}
