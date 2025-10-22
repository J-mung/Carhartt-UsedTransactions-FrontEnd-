import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carHarttApi } from '@/shared/api/axios';

const USE_MOCK_DATA = true;

// 상품이 찜 목록에 있는지 확인
export function useWishlistStatus(itemId) {
  return useQuery({
    queryKey: ['wishlist', 'status', itemId],
    queryFn: async () => {
      // Mock data
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return { wished: false };
      }

      // Real API
      const response = await carHarttApi({
        method: 'GET',
        url: `/v1/wishes/${itemId}/status`,
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!itemId,
  });
}

// 찜 목록 불러오기
export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      // Mock data
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return [];
      }

      // Real API
      const response = await carHarttApi({
        method: 'GET',
        url: '/v1/wishes',
        withCredentials: true,
      });
      return response.data;
    },
  });
}

// 아이템 찜 목록에 추가
export function useAddWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId) => {
      // Mock data
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { success: true };
      }

      // Real API
      const response = await carHarttApi({
        method: 'POST',
        url: '/v1/wishes',
        data: { itemId },
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
  });
}

// 아이템 찜 목록에서 제거
export function useRemoveWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId) => {
      // Mock data
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { success: true };
      }

      // Real API
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
