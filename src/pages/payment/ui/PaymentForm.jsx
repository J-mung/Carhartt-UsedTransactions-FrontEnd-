import { useOrderMutation } from '@/entities/order/hooks/useOrderMutation';
import { usePaymentReadyMutation } from '@/entities/payment/hooks/usePaymentReadyMutation';
import { useProductDetail } from '@/entities/product/hooks/useProduct';
import { Button } from '@/shared/ui/buttons';
import InputBox from '@/shared/ui/InputBox';
import RadioGroup from '@/shared/ui/Radio';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate;

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
  const { mutateAsync: createOrder } = useOrderMutation();
  // 카카오페이 화면 요청 커스텀 hook
  const { mutateAsync: createPaymentReady } = usePaymentReadyMutation();

  // 기본 에러 모달
  const errorModal = (title, message, onClose = () => {}) => {
    openModal(Modal, {
      title: title,
      children: <span className={'text-regular'}>{message}</span>,
      onClose: onClose,
    });
  };

  // 결제 폼(form) 데이터 get
  const getFormData = (formData) => {
    return {
      address: formData.get('addressList'),
      payment: formData.get('paymentMethod'),
      message: formData.get('buyerMsg'),
    };
  };

  // 주문 생성 api payload 생성
  const createOrderPayload = (orderFormData) => {
    return {
      item_id: 22, // product.item_id
      address_id: 101, // orderFormData.address
      payment_method: orderFormData.payment,
      detail_message: orderFormData.message,
    };
  };

  // 주문 생성 api 요청 handler
  const handleOrder = async (payload, navigate) => {
    try {
      // api 요청
      const result = await createOrder(payload);

      // 주문 ID가 확인되지 않을 경우
      if (!result?.order_id) {
        throw { code: 'O000', message: '주문 ID가 존재하지 않습니다.' };
      }

      return result.order_id;
    } catch (error) {
      // error handler 호출
      orderErrorHandler(error, payload, navigate);

      // 명시적으로 throw해서 상위 결제 준비 로직 중단
      throw error;
    }
  };

  // 주문 생성 api error shooting handler
  const orderErrorHandler = ({ error, payload, navigate }) => {
    // 코드 별 route 주소
    const routes = {
      O004: () => navigate(`/product/${payload.item_id}`),
      O005: () => navigate('/'),
      O006: () => navigate('/payment/result?status=invalid'),
    };

    // 에러 모달 열기
    errorModal({
      title:
        {
          O004: '주문을 찾을 수 없습니다.',
          O005: '접근 권한이 없습니다.',
          O006: '유효하지 않은 주문 상태',
        }[error.code] ?? '알 수 없는 오류',
      message: error.message,
      onClose: routes[error.code],
    });
  };

  const handlePaymentReady = async ({
    orderId,
    paymentMethod,
    amount,
    navigate,
  }) => {
    try {
      const result = await createPaymentReady({
        orderId: orderId,
        paymentMethod: paymentMethod,
        amount: amount,
      });
      if (!result?.next_redirect_pc_url) {
        throw {
          code: 'P000',
          message:
            '예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        };
      }

      return result.next_redirect_pc_url;
    } catch (error) {
      handlePaymentReadyError({ error, payload, navigate });
    }
  };

  // 결제 요청 api error shooting handler
  const handlePaymentReadyError = ({ error, payload, navigate }) => {
    // 코드별 route 정의
    const routes = {
      P001: () => navigate('/payment/result?status=invalid'),
      P002: () => navigate(`/product/${payload.item_id}`),
      P003: () => navigate('/'),
      P004: () => {}, // stay
      P005: () => navigate(`/payment/${payload.item_id}`),
      P006: () => navigate('/payment/result?status=duplicated'),
      P007: () => navigate('/payment/result?status=progress'),
    };

    // 코드별 title 정의
    const titles = {
      P001: '결제 불가 상태',
      P002: '주문 정보 없음',
      P003: '접근 권한 없음',
      P004: '결제창 오류',
      P005: '요청 데이터 오류',
      P006: '중복 결제 요청',
      P007: '결제 시도 중복',
      DEFAULT: '결제 요청 실패',
    };

    const code = error.code || 'DEFAULT';
    const title = titles[code] ?? titles.DEFAULT;

    // 서버에서 내려온 message를 그대로 표시
    errorModal({
      title,
      message: error.message,
      onClose: routes[code] || (() => {}),
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    // 주문 신청서에서 필요한 데이터 get
    const formData = getFormData(new FormData(e.currentTarget));
    // 주문 생성 api payload 생성
    const orderPayload = createOrderPayload(formData);

    try {
      // 주문 생성
      const orderId = await handleOrder(orderPayload, navigate);
      // 결제 준비
      const paymentReadyUrl = await handlePaymentReady({
        orderId,
        paymentMethod: formData.payment,
        amount: product.item_price,
        navigate,
      });

      // PG 결제창으로 이동
      window.location.href = paymentReadyUrl;
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
