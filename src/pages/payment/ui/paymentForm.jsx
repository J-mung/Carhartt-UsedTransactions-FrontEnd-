import { useProducts } from '@/entities/product/hooks/useProduct';
import { useAddresses } from '@/entities/user/hooks/useAddresses';
import { Button } from '@/shared/ui/buttons';
import RadioGroup from '@/shared/ui/Radio';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useEffect, useRef, useState } from 'react';

export default function PaymentForm() {
  const formRef = useRef(null);

  const { openModal } = useModal();
  const {
    product,
    loading: productLoading,
    error: productError,
  } = useProducts();
  const {
    addresses,
    loading: addressesLoading,
    error: addressesError,
  } = useAddresses();

  const [curAddress, setCurAddress] = useState(undefined);
  const [msgToSeller, setMsgToSeller] = useState('');
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
  const handleInputMsg = (e) => {
    setMsgToSeller(e.target.value);
  };
  const handlePayment = (e) => {
    e.preventDefault();
    openModal(Modal, {
      title: '알림',
      children: <span className={'text-regular'}>결제하기 버튼</span>,
    });
  };

  // 주소지 조회
  useEffect(() => {
    // 주소지 조회 성공 시
    if (!addressesLoading && addresses.length > 0) {
      setCurAddress({ ...addresses[0] });
    }
    if (payOptions && payOptions.length > 0) {
      setMethod({ ...payOptions[0] });
    }
  }, [addressesLoading, addresses]);

  const isLoading = productLoading || addressesLoading;

  // loading 중
  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  // 구매 페이지 구성 중 에러 발생
  if (productError || addressesError) {
    return <p>에러가 발생했습니다.</p>;
  }

  return (
    <div>
      <p>결제 요청 신청서 화면입니다.</p>
      <p>상품명: {product.name}</p>
      <form ref={formRef} onSubmit={handlePayment}>
        {curAddress ? (
          <RadioGroup
            label={'배송지'}
            name={'addressList'}
            value={curAddress?.value}
            onChange={(e) => {
              const selected = addresses.find(
                (_addr) => _addr.key === e.target.key
              );
              setCurAddress(selected);
            }}
            variant={'radio'}
            options={addresses}
          />
        ) : (
          <p>주소지가 없습니다.</p>
        )}

        <span>판매자에게 전달할 요청사항</span>
        <input onChange={handleInputMsg}></input>
        <br />
        <RadioGroup
          label={'결제 수단'}
          name={'paymentMethod'}
          value={method.value}
          onChange={(e) => {
            const selected = payOptions.find(
              (_opt) => _opt.key === e.target.key
            );
            setMethod(selected);
          }}
          options={payOptions}
        />
        {productLoading ? (
          <p>상품 정보 로딩 중...</p>
        ) : (
          <Button
            label={`${product.price} 결제하기`}
            onClick={() => formRef.current?.requestSubmit?.()}
          />
        )}
      </form>
    </div>
  );
}
