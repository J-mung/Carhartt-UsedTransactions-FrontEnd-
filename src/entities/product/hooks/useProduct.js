import AlternativeImage from '@/app/assets/images/AlternativeImage.jpg';
import { carHarttApi } from '@/shared/api/axios'; // 커스텀 axios 인스턴스
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  productData,
  mockCategories,
  mockProductsList,
} from '@/pages/single-product/model/mockProductData';

export function useProducts(productId) {
  const [product, setProduct] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    let isMounted = true; // 언마운트 시 setState 방지

    setLoading(true);

    if (!productId) {
      // API 준비 전: mock 데이터
      setProduct({
        id: 1,
        name: '고성능 보조배터리 - 묠니르',
        img: AlternativeImage,
        price: 9900,
      });
      setLoading(false);
      return;
    }

    carHarttApi({
      method: 'GET',
      url: `/v1/items/${productId}`,
      responseType: 'application/json',
    })
      .then((response) => {
        if (isMounted) {
          // API 응답 구조에 맞게 조정 필요
          // 필요 시, model 디렉터리 추가 후 타입/DTO/도메인 로직 등 정의
          setProduct(response.data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return { product, loading, error };
}

const USE_MOCK_DATA = true;

// Fetch 상품 상세 정보
// GET /v1/items/{itemId}
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
// GET /v1/items?category_id=1&sort=recent&page=1&limit=16
export function useProductsList({
  categoryId,
  sort = 'recent',
  page = 1,
  limit = 16,
} = {}) {
  return useQuery({
    queryKey: ['products', 'list', { categoryId, sort, page, limit }],
    queryFn: async () => {
      // Mock data
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Filter by category
        let filtered = mockProductsList;
        if (categoryId !== 'all') {
          filtered = mockProductsList.filter((product) =>
            product.category_ids.includes(parseInt(categoryId))
          );
        }

        // Sort products
        const sorted = [...filtered].sort((a, b) => {
          switch (sort) {
            case 'recent':
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
            case 'price_low':
              return a.item_price - b.item_price;
            case 'price_high':
              return b.item_price - a.item_price;
            default:
              return 0;
          }
        });

        // Pagination (mock data only)
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = sorted.slice(startIndex, endIndex);

        return {
          items: paginatedItems,
          total: sorted.length,
          page,
          limit,
          totalPages: Math.ceil(sorted.length / limit),
        };
      }

      // Real API
      const params = {
        page,
        limit,
      };

      if (categoryId && categoryId !== 'all') {
        params.category_id = categoryId;
      }

      if (sort) {
        params.sort = sort;
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
        size: response.data?.size || limit,
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
