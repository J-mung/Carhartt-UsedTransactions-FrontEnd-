import { useState } from 'react';

export default function PaymentForm() {
  const [address, setAddress] = useState('add1');
  const [msgToSeller, setMsgToSeller] = useState('');
  const [method, setMethod] = useState('kakaoPay');
  const handleInputMsg = (msg) => {
    setMsgToSeller(msg);
  };
  const handlePayment = () => {
    alert('결제하기 버튼');
  };
  return (
    <div>
      <p>결제 요청 신청서 화면입니다.</p>
      <form onSubmit={handlePayment}>
        <span for={'address'}>[배송지]</span>
        <RadioGroup
          name="addresList"
          value={address}
          onChange={setAddress}
          options={[
            {
              value: 'add1',
              label: '집',
              description: ': 주소1',
            },
            { value: 'add2', label: '본가: 주소2' },
          ]}
        />

        <span for={'message'}>판매자에게 전달할 요청사항</span>
        <input onChange={handleInputMsg}></input>
        <br />
        <span for={'payment'}>[결제 수단]</span>
        <RadioGroup
          name="paymentMethod"
          value={method}
          onChange={setMethod}
          options={[
            {
              value: 'kakaoPay',
              label: '카카오페이',
              description: '',
            },
            { value: 'naverPay', label: '네이버페이' },
          ]}
        />
        <button type={'submit'}>결제하기</button>
      </form>
    </div>
  );
}

// shared/ui/Radio.jsx
import { useId } from 'react';

export function Radio({
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
  const id = useId();

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
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        className="radio__input"
      />
      <span aria-hidden="true" className="radio__control" />
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
          key={opt.value}
          name={name}
          value={opt.value}
          label={opt.label}
          description={opt.description}
          disabled={disabled || opt.disabled}
          checked={value === opt.value}
          onChange={onChange}
          error={error}
        />
      ))}
    </div>
  );
}
