import AlternativeImage from '@/app/assets/images/AlternativeImage.jpg';
import '@/pages/payment/ui/paymentResult.scss';
import { carHarttApi } from '@/shared/api/axios';
import { useMockToggle } from '@/shared/config/MockToggleProvider';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useEffect, useState } from 'react';

export default function PaymentResult() {
  const [paymentResult, setPaymentResult] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(undefined);
  const { openModal } = useModal();
  const { useMock } = useMockToggle();

  useEffect(() => {
    //결제 성공 정보
    getPaymentResult('');
  }, []);
  const getPaymentResult = (orderId) => {
    // Mock data 반환
    if (useMock) {
      setPaymentInfo({
        itemId: 1,
        itemName: '근면성실한 샐러리',
        itemPrice: 95000,
        itemImg: AlternativeImage,
        addressDetail: '서울특별시 강남구 역삼동 ㅁㅁㅁ-ㅁㅁㅁ',
        orderDateTime: Date.now(),
      });
      setPaymentResult(true);
    } else {
      // 결제 성공 확인 API
      carHarttApi({
        method: 'GET',
        url: `v1/order/${orderId}/summary`,
      })
        .then((response) => {
          const { status, data, meta } = response;
          if (!!data) {
            setPaymentResult(true);
            setPaymentInfo({
              ...data,
            });
          } else {
            openModal(Modal, {
              title: '결제 실패',
              children: (
                <span className={'text-strong'}>
                  알 수 없는 에러로 결제 실패 했습니다.
                </span>
              ),
            });
          }
        })
        .catch((error) => {
          openModal(Modal, {
            title: '결제 실패',
            children: (
              <>
                <span className={'text-strong'}>
                  에러로 결제 실패 했습니다.
                </span>
                <span claaName={'text-regular'}>{error.message}</span>
              </>
            ),
          });
        });
    }
  };

  // if (productLoading) {
  //   return (
  //     <div className={'payment-result--wrapper'}>
  //       <span className={'text-regular'}>로딩 중...</span>
  //     </div>
  //   );
  // }

  if (!paymentResult) {
    return (
      <div className={'payment-result--wrapper'}>
        <span className={'text-regular'}>
          상품 정보 로드 에러: {'productError'}
        </span>
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
            src={paymentInfo.itemImg ?? ''}
            alt={AlternativeImage}
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
                    {paymentInfo[key] ?? '-'}
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
            {Number(paymentInfo.itemPrice).toLocaleString('ko-KR', {
              style: 'currency',
              currency: 'KRW',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
