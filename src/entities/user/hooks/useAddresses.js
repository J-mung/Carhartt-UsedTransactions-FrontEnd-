import { mockAddresses } from '@/pages/mypage/model/mockAddressData';
import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useQuery } from '@tanstack/react-query';

export function useAddressesQuery(userId) {
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
      try {
        const response = await carHarttApi({
          method: 'GET',
          url: `/v1/orders/address?member_id=${userId}`,
        });

        const data = response.data;

        return {
          count: data.address_number,
          list: convertAddressInfo(data.address_item_list),
        };
      } catch (error) {
        console.error(`주소지 목록 조회 API 에러 : ${error}`);
        throw error;
      }
    },
  });
}
