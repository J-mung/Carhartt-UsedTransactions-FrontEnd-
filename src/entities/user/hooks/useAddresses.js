import { mockAddresses } from '@/pages/mypage/model/mockAddressData';
import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * 사용자 배송지 목록 조회 API
 * @param {*} userId
 * @returns
 */
export function useAddresses(userId) {
  const queryClient = useQueryClient();
  const { useMock } = useMockToggle();

  const convertAddressInfo = (list) => {
    return list.map((_addr) => ({
      key: String(_addr.address_id),
      alias: _addr.address_name,
      value: `${_addr.road_address} ${_addr.detail_address}`,
      zip: _addr.zip_code,
      label: `${_addr.address_name}: ${_addr.road_address} ${_addr.detail_address}`,
    }));
  };

  return useQuery({
    queryKey: ['addresses', userId],
    queryFn: async () => {
      // Mock data
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
          count: mockAddresses.length,
          list: convertAddressInfo(mockAddresses),
        };
      }

      // API 요청
      const response = await carHarttApi({
        method: 'GET',
        url: `/v1/orders/address?member_id=${userId}`,
      });

      // 응답 fallback
      const data = response?.data ?? {};

      return {
        count: data.address_number ?? 0,
        list: convertAddressInfo(data.address_item_list ?? []),
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['addresses', userId],
      });
    },
    onError: (error) => {
      console.error(`주소지 목록 조회 API 에러 : ${error}`);
    },
  });
}
