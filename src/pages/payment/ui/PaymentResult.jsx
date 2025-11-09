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
  const orderId = urlSearchParams.get('order_id');

  // usePaymentApproveMutation (승인 요청)
  const approveMutation = usePaymentApproveMutation();
  // usePaymentResultMutation (결제 완료된 상품 정보 요청)
  const resultMutation = usePaymentResultMutation();
  const [paymentResult, setPaymentResult] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(undefined);

  // 기본 에러 모달 -> PaymentForm에도 있는 거라 공통으로 분리
  const errorModal = (title, message, onClose = () => {}) => {
    openModal(Modal, {
      title: title,
      children: <span className={'text-regular'}>{message}</span>,
      onClose: onClose,
    });
  };
  // 결제 승인 api payload 빌더
  const buildPaymentApprovePayload = (urlSearchParams) => {
    return {
      provider: urlSearchParams.get('provider'),
      pgToken: urlSearchParams.get('pg_token'),
      orderId: urlSearchParams.get('orderId'),
    };
  };
  // 결제 승인 api 핸들러
  const handlePaymentApprove = async (payload) => {
    const { mutateAsync: requestApprove } = approveMutation;

    try {
      const result = await requestApprove(payload);

      if (!result?.order_id) {
        throw {
          code: 'P000',
          message:
            '예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        };
      }

      return result.order_id;
    } catch (error) {
      handlePaymentApproveError({ error, payload, navigate });
      throw error;
    }
  };
  // 결제 승인 api error 핸들러
  const handlePaymentApproveError = ({ error, payload, navigate }) => {
    // 코드별 routes 정의
    const routes = {
      P008: () => navigate('/payment'),
      P009: () => navigate('/payment/result?status=fail'),
    };
    // 코드별 모달 title 정의
    const titles = {
      P008: '결제 취소',
      P009: '결제 실패',
      DEFAULT: '결제 승인 오류',
    };

    const code = error.code || 'DEFAULT';
    const title = titles[error.code] ?? title.DEFAULT;
    // 모달 open
    errorModal({
      title: title,
      message: error.message,
      onClose: routes[code] || (() => {}),
    });
  };

  // 결제 승인된 상품 조회 api 핸들러
  const handleApprovedItem = async (payload) => {
    const { mutateAsync: requestApprovedItem } = resultMutation;

    try {
      const approvedItem = requestApprovedItem(payload);

      if (!approvedItem) {
        throw {
          code: 'O000',
          message:
            '예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        };
      }

      return approvedItem;
    } catch (error) {
      handleApprovedItemError({ error, payload, navigate });
      throw error;
    }
  };
  // 결제 승인된 상품 조회 api error 핸들러
  const handleApprovedItemError = ({ error, payload, navigate }) => {
    // 코드별 routes 경로 정의
    const routes = {
      O004: () => navigate('/'),
      O005: () => navigate('/'),
      O006: () => navigate('/payment'),
    };
    // title 정의
    const titles = {
      O004: '주문 조회 실패',
      O005: '접근 제한',
      O006: '미결제 주문',
      DEFAULT: '결제 상품 조회 실패',
    };

    const code = error.code || 'DEFAULT';
    const title = titles[error.code] ?? title.DEFAULT;
    // 모달 open
    errorModal({
      title: title,
      message: error.message,
      onClose: routes[code] || (() => {}),
    });
  };

  // 결제 승인 후 주문정보 조회
  useEffect(() => {
    if (!pgToken || !provider || !orderId) return;

    let cancelled = false;

    (async () => {
      try {
        // 결제 승인 요청
        const approvePayload = buildPaymentApprovePayload(urlSearchParams);
        // 결제 승인된 주문 번호
        const approveOrderId = await handlePaymentApprove(approvePayload);

        // 주문정보 조회
        if (!cancelled) {
          const result = await handleApprovedItem({ orderId: approveOrderId });
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
  }, [pgToken, provider, orderId]);

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
