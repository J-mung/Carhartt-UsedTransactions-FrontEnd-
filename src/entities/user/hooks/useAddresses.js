import { mockAddresses } from '@/pages/mypage/model/mockAddressData';
import { carHarttApi } from '@/shared/api/axios';
import { useMockConfig } from '@/shared/config/mockConfig';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAddresses(userId) {
  const { isMockConfig: isMockConfigFromContext } = useMockConfig();
  const USE_MOCK_DATA = Boolean(isMockConfigFromContext);

  return useQuery({
    queryKey: ['addresses', userId], // userId 별 캐시 구분
    enabled: !!userId || USE_MOCK_DATA, // userId 없을 경우 쿼리 비활성화
    queryFn: async () => {
      // Mock data
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return mockAddresses.addresses;
      }

      // 실제 Request API
      const response = carHarttApi({
        method: 'GET',
        url: `/orders/address?member_id=${userId}`,
        responseType: 'application/json',
      });

      // 서버 응답 구조에 따라 추후 조정
      return (await response).data.addresses ?? [];
    },
    staleTime: 1000 * 60, // 1분 동안 fresh 상태 유지
    retry: 1, // 실패 시 한 번만 재시도
  });
}

export function useRemoveAddresses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addrKey) => {
      // Mock data
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { success: true };
      }

      // 실제 Request API
      const response = await carHarttApi({
        method: 'DELETE',
        url: `/orders/address/${addrKey}`,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['addresses']);
    },
  });
}
