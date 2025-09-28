import { useProducts } from '@/entities/product/hooks/useProduct';
import { useAddresses } from '@/entities/user/hooks/useAddresses';
import { useEffect, useState } from 'react';

export default function PaymentForm() {
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
  const [method, setMethod] = useState('pay1');
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
    alert('결제하기 버튼');
  };

  // 주소지 조회
  useEffect(() => {
    // 주소지 조회 성공 시
    if (!addressesLoading && addresses.length > 0) {
      setCurAddress({ ...addresses[0] });
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
      <form onSubmit={handlePayment}>
        <span>[배송지]</span>
        {curAddress ? (
          <RadioGroup
            name="addressList"
            value={curAddress?.key}
            onChange={(val) => {
              const selected = addresses.find((a) => a.key === val);
              setCurAddress(selected);
            }}
            options={addresses}
          />
        ) : (
          <p>주소지가 없습니다.</p>
        )}
        <span>판매자에게 전달할 요청사항</span>
        <input onChange={handleInputMsg}></input>
        <br />
        <span>[결제 수단]</span>
        <RadioGroup
          name="paymentMethod"
          value={method}
          onChange={(val) => {
            const selected = payOptions.find((_opt) => _opt.key === val);
            setMethod(selected.key);
          }}
          options={payOptions}
        />
        {productLoading ? (
          <p>상품 정보 로딩 중...</p>
        ) : (
          <button type={'submit'}>{product.price}결제하기</button>
        )}
      </form>
    </div>
  );
}

// shared/ui/Radio.jsx

export function Radio({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
  description,
  error = false,
  className = '',
}) {
  return (
    <label
      htmlFor={id}
      className={`radio ${disabled ? 'is-disabled' : ''} ${error ? 'is-error' : ''} ${className}`}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.value)} // value로 전달
        disabled={disabled}
        className="radio__input"
      />
      <span className="radio__label">
        {label}
        {description && <span className="radio__desc">{description}</span>}
      </span>
    </label>
  );
}

// 옵션 배열을 받아 간단히 묶어주는 그룹
export function RadioGroup({
  name,
  options = [], // [{ value, label, description, disabled }]
  value,
  onChange,
  disabled = false,
  className = '',
  error = false,
}) {
  return (
    <div role="radiogroup" className={`radio-group ${className}`}>
      {options.map((opt) => (
        <Radio
          id={opt.key}
          key={opt.key}
          name={name}
          value={opt.key}
          label={opt.alias || opt.label}
          description={opt.value || opt.description}
          disabled={disabled || opt.disabled}
          checked={value === opt.key}
          onChange={onChange}
          error={error}
        />
      ))}
    </div>
  );
}
