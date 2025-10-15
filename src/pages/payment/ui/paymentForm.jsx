import { useProducts } from '@/entities/product/hooks/useProduct';
import { Button } from '@/shared/ui/buttons';
import InputBox from '@/shared/ui/InputBox';
import RadioGroup from '@/shared/ui/Radio';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useEffect, useRef, useState } from 'react';
import AddressRadioGroup from './AddressRadioGroup';
import './paymentForm.scss';

export default function PaymentForm() {
  const formRef = useRef(null);

  const { openModal } = useModal();
  const {
    product,
    loading: productLoading,
    error: productError,
  } = useProducts();

  const [buyerMessage, setBuyerMessage] = useState('');
  const [method, setMethod] = useState(undefined);

  const payOptions = [
    {
      key: 'pay1',
      value: 'kakaoPay',
      label: '카카오페이',
    },
    {
      key: 'pay2',
      value: 'naverPay',
      label: '네이버페이',
    },
  ];

  useEffect(() => {
    if (payOptions && payOptions.length > 0) {
      setMethod({ ...payOptions[0] });
    }
  }, []); // 최초 1회만 실행

  const handleInputMsg = (e) => {
    setBuyerMessage(e.target.value);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    openModal(Modal, {
      title: '알림',
      children: <span className={'text-regular'}>결제하기 버튼</span>,
    });
  };

  const contentWrapper = (title, children) => {
    return (
      <>
        <span className={'h4'}>{title}</span>
        <div className={'content--wrapper mt-2 mb-4'}>{children}</div>
      </>
    );
  };

  const isLoading = productLoading;

  // loading 중
  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  // 구매 페이지 구성 중 에러 발생
  if (productError) {
    return <p>에러가 발생했습니다.</p>;
  }

  return (
    <div className={'payment-form ml-auto mr-auto'}>
      {contentWrapper(
        '상품정보',
        <span className={'text-regular'}>상품명: {product.name}</span>
      )}
      <form ref={formRef} onSubmit={handlePayment}>
        <AddressRadioGroup userId={''} />
        {contentWrapper(
          '요청사항',
          <InputBox
            label={''}
            name={'buyer_msg'}
            variant={'default'}
            placeholder={'판매자에게 전달할 요청사항'}
            value={buyerMessage}
            onChange={(e) => setBuyerMessage(e.target.value)}
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
                (_opt) => _opt.key === e.target.key
              );
              setMethod(selected);
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
              label={`${product.price} 결제하기`}
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
