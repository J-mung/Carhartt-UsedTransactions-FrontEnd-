import { mockAddresses } from '@/pages/mypage/model/mockAddressData';
import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * 사용자 배송지 목록 조회 API
 * GET /v1/orders/address?member_id={id}
 *
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
    enabled: !!userId,
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
    onError: (error) => {
      console.error(`주소지 목록 조회 API 에러 : ${error}`);
    },
  });
}

/**
 * 배송지 등록 API
 * POST /v1/orders/address
 *
 * @returns
 */
export function useEnrollAddress(userId) {
  const queryClient = useQueryClient();
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async (payload) => {
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: true };
      }

      const response = await carHarttApi({
        method: 'POST',
        url: '/v1/orders/address',
        data: JSON.stringify(payload),
      });

      const data = response?.data ?? {};

      return data;
    },
    onSuccess: (_, payload) => {
      if (useMock) {
        queryClient.setQueryData(['addresses', userId], (prev) => {
          if (!prev) return prev;

          const newItem = {
            key: prev.count + 1,
            alias: payload.alias,
            value: `${payload.roadAddress} ${payload.detailAddress}`,
            zip: payload.zip,
            label: `${payload.alias}: ${payload.roadAddress} ${payload.detailAddress}`,
          };

          return {
            count: prev.count + 1,
            list: [...prev.list, newItem],
          };
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
    },
    onError: (error) => {
      console.error(`배송지 등록 API 에러 발생 : ${error}`);
    },
  });
}

/**
 * 배송지 삭제 API
 * DELETE /v1/orders/address/{address_id}
 *
 * @param {*} userId
 * @returns
 */
export function useDeleteAddress(userId) {
  const queryClient = useQueryClient();
  const { useMock } = useMockToggle();

  return useMutation({
    mutationFn: async (address_id) => {
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { deleted: true };
      }

      const response = await carHarttApi({
        method: 'DELETE',
        url: `/v1/orders/address/${address_id}`,
      });

      const data = response?.data ?? {};

      return data;
    },
    onSuccess: (_, address_id) => {
      if (useMock) {
        queryClient.setQueryData(['addresses', userId], (prev) => {
          if (!prev) return prev;

          const filtered = prev.list.filter(
            (item) => item.key !== String(address_id)
          );

          return {
            count: filtered.length,
            list: filtered,
          };
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['addresses', userId] });
    },
    onError: (error) => {
      console.error(`배송지 삭제 API 에러 발생 : ${error}`);
    },
  });
}
