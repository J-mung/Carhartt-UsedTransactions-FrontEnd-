import useDaumPostcodeModal from '@/entities/user/hooks/useDaumPostcodeModal';
import { Button } from '@/shared/ui/buttons';
import InputBox from '@/shared/ui/InputBox';
import { useState } from 'react';

export default function AddressAddForm() {
  // 주소 등록 신청서 상태
  const [form, setForm] = useState({
    zip: '',
    roadAddress: '',
    jibunAddress: '',
    buildingName: '',
    addressType: '',
    extraAddress: '',
    guide: '',
    alias: '',
    raw: '',
  });
  const { openPostcode } = useDaumPostcodeModal();

  const handleSearchAddress = async () => {
    const result = await openPostcode();
    if (!result) return;

    setForm({ ...result });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  function InputWrapper({ children }) {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ margin: '-1rem auto', flex: 1 }}>{children}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        margin: '1rem auto 0rem auto',
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <InputWrapper>
          <InputBox
            type={'text'}
            name={'postcode'}
            placeholder={'우편번호'}
            value={form.postcode}
            onChange={handleChange}
          />
        </InputWrapper>
        <Button
          label={'우편번호 찾기'}
          variant={'standard-secondary'}
          onClick={handleSearchAddress}
        />
      </div>

      <InputWrapper>
        <InputBox
          type={'text'}
          name={form.addressType === 'R' ? 'roadAddress' : 'jibunAddress'}
          placeholder={'주소'}
          value={
            form.addressType === 'R' ? form.roadAddress : form.jibunAddress
          }
          onChange={handleChange}
          disabled={true}
        />
      </InputWrapper>
      <InputWrapper>
        <InputBox
          type={'text'}
          name={'detailAddress'}
          placeholder={'상세주소'}
          value={form.detailAddress}
          onChange={handleChange}
        />
      </InputWrapper>
      <InputWrapper>
        <InputBox
          type={'text'}
          name={'alias'}
          placeholder={'주소 별칭'}
          value={form.alias}
          onChange={handleChange}
        />
      </InputWrapper>

      {/* 가이드 텍스트 (예상 도로명/지번 주소) */}
      {form.guide && <span style={{ color: '#999' }}>{form.guide}</span>}

      <Button label={'등록'} variant={'standard-primary'} />
    </div>
  );
}
