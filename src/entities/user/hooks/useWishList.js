import { mockWishlistData } from '@/pages/single-product/model/mockWishListData';
import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 상품이 찜 목록에 있는지 확인
// GET /v1/wishes/{itemId}/status
export function useWishlistStatus(itemId) {
  const queryClient = useQueryClient();
  const { useMock } = useMockToggle();

  return useQuery({
    queryKey: ['wishlist', 'status', itemId],
    queryFn: async () => {
      // mock 데이터 사용
      if (useMock) {
        // caching된 wishlist 가져오기 (없으면 mock 데이터 fallback)
        const wishlist =
          queryClient.getQueryData(['wishlist']) ?? mockWishlistData;
        const wished = wishlist.some((item) => item.id === itemId);
        return { wished };
      }
      const response = await carHarttApi({
        method: 'GET',
        url: `/v1/wishes/${itemId}/status`,
        withCredentials: true,
      });
      return response.data?.data || { wished: false };
    },
    enabled: !!itemId,
  });
}

// 찜 목록 불러오기
// GET /v1/wishes
export function useWishlist() {
  const queryClient = useQueryClient();
  const { useMock } = useMockToggle();

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      // mock 데이터 사용
      if (useMock) {
        // 최초 mock 데이터 caching
        const cached = queryClient.getQueryData(['wishlist']);
        if (cached) return cached;

        await new Promise((resolve) => setTimeout(resolve, 1000));
        queryClient.setQueryData(['wishlist'], mockWishlistData);
        return mockWishlistData;
      }

      const response = await carHarttApi({
        method: 'GET',
        url: '/v1/wishes',
        withCredentials: true,
      });
      return response?.data || [];
    },
  });
}

// 찜 목록에 아이템 추가
// POST /v1/wishes
export function useAddWishlist() {
  const queryClient = useQueryClient();
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async (itemId) => {
      if (useMock) {
        return { itemId };
      }
      const response = await carHarttApi({
        method: 'POST',
        url: '/v1/wishes',
        data: { item_id: itemId },
        withCredentials: true,
      });
      return response.data;
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries(['wishlist']);

      // 롤백용 리스트
      const prev = queryClient.getQueryData(['wishlist']) || mockWishlistData;

      // ui 업데이트 리스트 (Optimistic Update)
      const next = [...prev, { id: itemId }];
      queryClient.setQueryData(['wishlist'], next);
      // (기대)성공 결과 선반영
      queryClient.setQueryData(['wishlist', 'status', itemId], {
        wished: true,
      });

      // 서버로부터 실패 응답을 받았을 경우 롤백하기 위해 prev 반환
      return { prev };
    },
    onError: (error, itemId, context) => {
      if (context?.prev) queryClient.setQueryData(['wishlist'], context.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['wishlist']);
    },
  });
}

// 찜 목록에서 아이템 제거
// DELETE /v1/wishes/{itemId}
export function useRemoveWishlist() {
  const queryClient = useQueryClient();
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async (itemId) => {
      if (useMock) {
        return { itemId };
      }

      const response = await carHarttApi({
        method: 'DELETE',
        url: `/v1/wishes/${itemId}`,
        withCredentials: true,
      });
      return response.data;
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries(['wishlist']);

      // 롤백용 리스트
      const prev = queryClient.getQueryData(['wishlist']) || mockWishlistData;

      // ui 업데이트 리스트 (Optimistic Update)
      const next = prev.filter((item) => item.id === itemId);
      queryClient.setQueryData(['wishlist'], next);
      // (기대)성공 결과 선반영
      queryClient.setQueryData(['wishlist', 'status', itemId], {
        wished: false,
      });

      // 서버로부터 실패 응답을 받았을 경우 롤백하기 위해 prev 반환
      return { prev };
    },
    onError: (error, itemId, context) => {
      if (context?.prev) queryClient.setQueryData(['wishlist'], context.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['wishlist']);
    },
  });
}

// 찜 목록 toggle - 아이템 추가/삭제
export function useToggleWishlist() {
  const addWishlist = useAddWishlist();
  const removeWishlist = useRemoveWishlist();

  return {
    toggleWishlist: async (itemId, currentStatus) => {
      if (currentStatus) {
        return removeWishlist.mutateAsync(itemId);
      } else {
        return addWishlist.mutateAsync(itemId);
      }
    },
    isLoading: addWishlist.isPending || removeWishlist.isPending,
  };
}
