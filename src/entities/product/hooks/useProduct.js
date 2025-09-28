import { carHarttApi } from '@/shared/api/axios'; // 커스텀 axios 인스턴스
import { useEffect, useState } from 'react';

export function useProducts(productId) {
  const [product, setProduct] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    let isMounted = true; // 언마운트 시 setState 방지

    setLoading(true);

    if (!productId) {
      // API 준비 전: mock 데이터
      setProduct({
        name: '고성능 보조배터리 - 묠니르',
        price: 9900,
      });
      setLoading(false);
      return;
    }

    carHarttApi({
      method: 'GET',
      url: `/v1/items/${productId}`,
      responseType: 'application/json',
    })
      .then((response) => {
        if (isMounted) {
          // API 응답 구조에 맞게 조정 필요
          // 필요 시, model 디렉터리 추가 후 타입/DTO/도메인 로직 등 정의
          setProduct(response.data);
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
  }, [productId]);

  return { product, loading, error };
}
