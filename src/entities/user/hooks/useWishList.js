import { mockWishListData } from '@/pages/single-product/model/mockWishListData';
import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 상품이 찜 목록에 있는지 확인
// GET /v1/wishes/{itemId}/status
export function useWishlistStatus(itemId) {
  return useQuery({
    queryKey: ['wishlist', 'status', itemId],
    queryFn: async () => {
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
  const { useMock } = useMockToggle();

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return mockWishListData;
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

  return useMutation({
    mutationFn: async (itemId) => {
      const response = await carHarttApi({
        method: 'POST',
        url: '/v1/wishes',
        data: { item_id: itemId },
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data, itemId) => {
      queryClient.setQueryData(['wishlist', 'status', itemId], {
        wished: true,
      });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (error, itemId) => {
      queryClient.invalidateQueries({
        queryKey: ['wishlist', 'status', itemId],
      });
    },
  });
}

// 찜 목록에서 아이템 제거
// DELETE /v1/wishes/{itemId}
export function useRemoveWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId) => {
      const response = await carHarttApi({
        method: 'DELETE',
        url: `/v1/wishes/${itemId}`,
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data, itemId) => {
      queryClient.setQueryData(['wishlist', 'status', itemId], {
        wished: false,
      });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (error, itemId) => {
      queryClient.invalidateQueries({
        queryKey: ['wishlist', 'status', itemId],
      });
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
