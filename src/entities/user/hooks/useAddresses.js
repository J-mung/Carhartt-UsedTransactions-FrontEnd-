import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useQuery } from '@tanstack/react-query';

const mockAddresses = [
  {
    key: '101',
    value: '주소1',
    alias: '집',
    label: '집: 주소1',
  },
  {
    key: '102',
    value: '주소2',
    alias: '본가',
    label: '본가: 주소2',
  },
];

export function useAddressesQuery(userId) {
  const { useMock } = useMockToggle();
  return useQuery({
    queryKey: ['addresses', userId],
    queryFn: async () => {
      console.log('[useAddressesQuery] queryFn called', { userId });

      // Mock data
      if (!useMock) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
          count: mockAddresses.length,
          list: mockAddresses,
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
          list: data.address_item_list.map((_addr) => ({
            key: String(_addr.address_id),
            alias: _addr.address_name,
            value: `${_addr.road_address} ${_addr.detail_address}`,
            zip: _addr.zip_code,
            label: `${_addr.address_name}: ${_addr.road_address} ${_addr.detail_address}`,
          })),
        };
      } catch (error) {
        console.error(`주소지 목록 조회 API 에러 : ${error}`);
        throw error;
      }
    },
  });
}
