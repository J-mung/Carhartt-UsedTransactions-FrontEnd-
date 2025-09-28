import { carHarttApi } from '@/shared/api/axios';
import { useEffect, useState } from 'react';

export function useAddresses(userId) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    let isMounted = true; // 언마운트 시 setState 방지

    setLoading(true);

    if (!userId) {
      // API 준비 전: mock 데이터
      setAddresses([
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
      ]);
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
  }, [userId]);

  return { addresses, loading, error };
}
