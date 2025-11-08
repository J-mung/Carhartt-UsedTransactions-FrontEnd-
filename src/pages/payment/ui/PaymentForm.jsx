import { useOrderMutation } from '@/entities/order/hooks/useOrderMutation';
import { usePaymentReadyMutation } from '@/entities/payment/hooks/usePaymentReadyMutation';
import { useProductDetail } from '@/entities/product/hooks/useProduct';
import { Button } from '@/shared/ui/buttons';
import InputBox from '@/shared/ui/InputBox';
import RadioGroup from '@/shared/ui/Radio';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddressRadioGroup from './AddressRadioGroup';
import './paymentForm.scss';

export default function PaymentForm() {
  const formRef = useRef(null);
  const { itemId } = useParams();
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProductDetail(itemId);
  const { openModal } = useModal();

  const [buyerMessage, setBuyerMessage] = useState('');
  const [method, setMethod] = useState({
    key: 'pay1',
    value: 'KAKAOPAY',
    label: '카카오페이',
  });

  const payOptions = [
    {
      key: 'pay1',
      value: 'KAKAOPAY',
      label: '카카오페이',
    },
    {
      key: 'pay2',
      value: 'naverPay',
      label: '네이버페이',
    },
  ];

  const handleInputMsg = (e) => {
    setBuyerMessage(e.target.value);
  };

  // 주문 생성 커스텀 hook
  const orderMutation = useOrderMutation();
  // 카카오페이 화면 요청 커스텀 hook
  const paymentReadyMutation = usePaymentReadyMutation();

  const handlePayment = async (e) => {
    e.preventDefault();
    // 주문 신청서에서 필요한 데이터 get
    const formData = new FormData(e.currentTarget);
    const address = formData.get('addressList');
    const payment = formData.get('paymentMethod');
    const message = formData.get('buyerMsg');
    const requestBody = {
      item_id: 22, // product.item_id
      address_id: 101, // address.id
      payment_method: payment,
      detail_message: message,
    };

    try {
      // 주문 생성
      const orderResponse = await orderMutation.mutateAsync(requestBody);
      // 결제 준비
      const paymentResultResponse = await paymentReadyMutation.mutateAsync({
        orderId: orderResponse.order_id,
        paymentMethod: payment,
        amount: product.item_price,
      });

      // TODO paymentResultResponse 결과에 따라 결제 진행
      // openModal(Modal, {
      //   title: '결제 준비 테스트 - 성공',
      //   children: (
      //     <span className={'text-regular'}>
      //       주문번호 {orderResponse.order_id}, 결제 준비 테스트 성공
      //     </span>
      //   ),
      // });
      window.location.href = paymentResultResponse?.next_redirect_pc_url || '/';
    } catch (error) {
      openModal(Modal, {
        title: '결제 준비 테스트 - 실패',
        children: (
          <span className={'text-regular'}>
            {error.message} {error.stack}
          </span>
        ),
      });
    }
  };

  const contentWrapper = (title, children) => {
    return (
      <>
        <span className={'h4'}>{title}</span>
        <div className={'content--wrapper mt-2 mb-4'}>{children}</div>
      </>
    );
  };

  // loading 중
  if (productLoading) {
    return <span className={'text-strong'}>로딩 중...</span>;
  }

  // 구매 페이지 구성 중 에러 발생
  if (productError) {
    return (
      <>
        <span className={'text-strong'}>에러가 발생했습니다.</span>
        <span className={'text-regular'}>{String(productError)}</span>
        <span className={'text-regular'}>잠시 후, 다시 시도해주세요.</span>
      </>
    );
  }

  return (
    <div className={'payment-form ml-auto mr-auto'}>
      {contentWrapper(
        '상품정보',
        <span className={'text-regular'}>
          상품명: {product?.item_name ?? '상품 정보 없음'}
        </span>
      )}
      <form ref={formRef} onSubmit={handlePayment}>
        <AddressRadioGroup userId={''} />
        {contentWrapper(
          '요청사항',
          <InputBox
            label={''}
            name={'buyerMsg'}
            variant={'default'}
            placeholder={'판매자에게 전달할 요청사항'}
            value={buyerMessage}
            onChange={(e) => handleInputMsg(e)}
            clear={true}
          />
        )}
        {contentWrapper(
          '결제수단',
          <RadioGroup
            label={''}
            name={'paymentMethod'}
            value={method.value}
            onChange={(e) => {
              const selected = payOptions.find(
                (_opt) => _opt.value === e.target.value
              );
              if (selected) setMethod(selected);
            }}
            options={payOptions}
            variant={'button'}
          />
        )}
        <div className={'flex'}>
          {productLoading ? (
            <p>상품 정보 로딩 중...</p>
          ) : (
            <Button
              label={`${product?.item_price ?? 0} 결제하기`}
              onClick={() => formRef.current?.requestSubmit?.()}
              size={'--l'}
              className={'form-btn__flex'}
            />
          )}
        </div>
      </form>
    </div>
  );
}
