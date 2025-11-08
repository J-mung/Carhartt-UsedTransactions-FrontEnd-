import AlternativeImage from '@/app/assets/images/AlternativeImage.jpg';
import { usePaymentApproveMutation } from '@/entities/payment/hooks/usePaymentApproveMutation';
import { usePaymentResultMutation } from '@/entities/payment/hooks/usePaymentResultMutation';
import '@/pages/payment/ui/paymentResult.scss';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PaymentResult() {
  // 결제 요청으로 uri에 추가된 pg_token query string추출
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const provider = urlSearchParams.get('provider');
  const pgToken = urlSearchParams.get('pg_token');

  // usePaymentApproveMutation (승인 요청)
  const approveMutation = usePaymentApproveMutation();
  // usePaymentResultMutation (결제 완료된 상품 정보 요청)
  const resultMutation = usePaymentResultMutation();

  const [paymentResult, setPaymentResult] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(undefined);

  // 결제 승인 후 주문정보 조회
  useEffect(() => {
    if (!pgToken || !provider) return;

    let cancelled = false;

    (async () => {
      try {
        // 결제 승인 요청
        const response = await approveMutation.mutateAsync({
          provider,
          pgToken,
        });
        const orderId = response?.order_id;
        if (!orderId) throw new Error('order_id 누락');

        // 주문정보 조회
        const result = await resultMutation.mutateAsync({ orderId });
        if (!cancelled) {
          setPaymentInfo(result);
          setPaymentResult(true);
        }
      } catch (error) {
        if (!cancelled) {
          setPaymentInfo(null);
          setPaymentResult(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pgToken, provider]);

  // 결제 승인 요청
  if (approveMutation.isPending) {
    return (
      <div className={'payment-result--wrapper'}>
        <span className={'text-regular'}>결제 승인 요청 중...</span>
      </div>
    );
  }
  // 결제 승인 실패
  if (approveMutation.isError) {
    return (
      <div className={'payment-result--wrapper'}>
        <span className={'text-regular'}>결제 승인 실패</span>
      </div>
    );
  }
  // 결제 완료 상품 정보 요청
  if (resultMutation.isPending) {
    return (
      <div className={'payment-result--wrapper'}>
        <span className={'text-regular'}>결제 완료 상품 정보 요청 중...</span>
      </div>
    );
  }
  // 결제 완료 상품 정보 요청 실패
  if (resultMutation.isError) {
    return (
      <div className={'payment-result--wrapper'}>
        <span className={'text-regular'}>결제 완료 상품 정보 요청 실패</span>
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div className={'payment-result--wrapper'}>
        <span className={'text-regular'}>결제 정보 없음</span>
      </div>
    );
  }

  return (
    <div className={'payment-result--wrapper ml-auto mr-auto'}>
      <div className={'payment-result--title'}>
        <span className={'h4'}>
          {paymentResult ? '결제 성공' : '결제 실패'}
        </span>
      </div>
      <div className={'payment-result--content mb-6'}>
        <div className={'mb-2'}>
          <span className={'h5'}>구매 상품</span>
        </div>
        <div className={'product--info'}>
          <img
            className={'info--image'}
            src={paymentInfo?.itemImg ?? AlternativeImage}
            alt={'상품 이미지'}
          />
          {/* == grid로 만들기 == */}
          <div className="info--table">
            {[
              { key: 'itemName', label: '상품명' },
              { key: 'addressDetail', label: '배송지' },
              { key: 'orderDateTime', label: '주문일자' },
            ].map(({ key, label }) => (
              <div className="info--table__row" key={key}>
                <div className="info--table__cell">
                  <span className="h5">{label} :</span>
                </div>
                <div className="info--table__cell">
                  <span className="text-regular">
                    {paymentInfo?.[key] ?? '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* == grid로 만들기 == */}
        </div>
      </div>
      <div className={'payment-result--content'}>
        <div className={'product--price'}>
          <span className={'h4'}>최종 결제 금액</span>
          <span className={'h4'}>
            {Number(paymentInfo?.itemPrice).toLocaleString('ko-KR', {
              style: 'currency',
              currency: 'KRW',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
