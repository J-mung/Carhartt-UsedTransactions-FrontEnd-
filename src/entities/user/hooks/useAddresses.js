import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { useEffect, useState } from 'react';

const mockAddresses = [
  {
    key: 'add1',
    value: '주소1',
    alias: '집',
    label: '집: 주소1',
  },
  {
    key: 'add2',
    value: '주소2',
    alias: '본가',
    label: '본가: 주소2',
  },
];

export function useAddresses(userId) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { useMock } = useMockToggle();

  const refresh = () => setReloadTrigger((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true; // 언마운트 시 setState 방지

    setLoading(true);

    if (useMock) {
      // API 준비 전: mock 데이터
      setAddresses(mockAddresses);
      setLoading(false);
      return;
    }

    carHarttApi({
      method: 'GET',
      url: `/v1/orders/address?member_id=${userId}`,
      responseType: 'application/json',
    })
      .then((response) => {
        if (isMounted) {
          // API 응답 구조에 맞게 조정 필요
          // 필요 시, model 디렉터리 추가 후 타입/DTO/도메인 로직 등 정의
          setAddresses([...response.data]);
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
  }, [userId, reloadTrigger]);

  return { addresses, loading, error, refresh };
}
