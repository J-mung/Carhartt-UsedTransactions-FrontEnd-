import {
  mockProductsList,
  productData,
} from '@/pages/single-product/model/mockProductData';
import { carHarttApi } from '@/shared/api/axios'; // 커스텀 axios 인스턴스
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useQuery } from '@tanstack/react-query';

// Fetch 상품 상세 정보
// GET /v1/items/{itemId}
export function useProductDetail(itemId) {
  const { useMock } = useMockToggle();

  return useQuery({
    queryKey: ['product', itemId],
    queryFn: async () => {
      // Mock data
      if (useMock) {
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

// Fetch 카테고리 목록
// GET /v1/categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await carHarttApi({
        method: 'GET',
        url: '/v1/categories',
        withCredentials: true,
      });
      return response.data || [];
    },
  });
}

// Fetch 상품 목록
// GET /v1/items?category_id=1&sort=createdAt,desc&page=1&size=16
export function useProductsList({
  categoryId,
  sortColumn = 'createdAt',
  sortDirect = 'desc',
  page = 1,
  size = 16,
} = {}) {
  const { useMock } = useMockToggle();

  return useQuery({
    queryKey: [
      'products',
      'list',
      { categoryId, sort: `${sortColumn},${sortDirect}`, page, size },
    ],
    queryFn: async () => {
      // Mock data
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Filter by category
        let filtered = mockProductsList;
        if (categoryId !== 'all') {
          filtered = mockProductsList.filter((product) =>
            product.category_ids.includes(parseInt(categoryId))
          );
        }

        // 정렬 방향에 맞게 정렬 순서 값 반환
        const calcSortVolume = (direct, x, y) => {
          return direct === 'asc' ? x - y : y - x;
        };

        // 정렬 항목에 맞춰 제품 정렬
        const sorted = [...filtered].sort((a, b) => {
          switch (sortColumn) {
            case 'createdAt': {
              return calcSortVolume(sortDirect, a.createdAt, b.createdAt);
            }
            case 'price': {
              return calcSortVolume(sortDirect, a.item_price, b.item_price);
            }
            case 'name': {
              return calcSortVolume(sortDirect, a.item_name, b.item_name);
            }
            default: {
              return 0;
            }
          }
        });

        // Pagination (mock data only)
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedItems = sorted.slice(startIndex, endIndex);

        return {
          items: paginatedItems,
          total: sorted.length,
          page,
          size,
          totalPages: Math.ceil(sorted.length / size),
        };
      }

      // Real API
      const params = {
        page: page - 1,
        size,
        sort: `${sortColumn},${sortDirect}`,
      };

      if (categoryId && categoryId !== 'all') {
        params.category_id = categoryId;
      }

      const response = await carHarttApi({
        method: 'GET',
        url: '/v1/items',
        params,
        withCredentials: true,
      });

      return {
        items: response.data?.content || [],
        total: response.data?.total_elements || 0,
        page: response.data?.page || 0,
        totalPages: response.data?.total_pages || 0,
        size: response.data?.size || size,
      };
    },
    keepPreviousData: true, // 새 페이지를 로딩하는 동안 이전 데이터 유지
  });
}

// Fetch 회원이 판매한 상품 목록
// GET /v1/items/mysolditems
export function useMyItems() {
  return useQuery({
    queryKey: ['my-items'],
    queryFn: async () => {
      const response = await carHarttApi({
        method: 'GET',
        url: '/v1/items/mysolditems',
        withCredentials: true,
      });

      return response.data || [];
    },
  });
}
