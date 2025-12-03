import useDaumPostcodeModal from '@/entities/user/hooks/useDaumPostcodeModal';
import InputBox from '@/shared/ui/InputBox';
import { useState } from 'react';

export default function AddressAddForm() {
  // 주소 등록 신청서 상태
  const [form, setForm] = useState({
    postcode: '',
    roadAddress: '',
    jibunAddress: '',
    buildingName: '',
    addressType: '',
    extraAddress: '',
    guide: '',
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

  return (
    <div
      style={{
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type={'text'}
          name={'postcode'}
          placeholder={'우편번호'}
          value={form.postcode}
          onChange={handleChange}
          style={{ flex: 1 }}
        />
        <button type={'button'} onClick={handleSearchAddress}>
          우편번호 찾기
        </button>
      </div>

      <InputBox
        type={'text'}
        name={'roadAddress'}
        placeholder={'도로명주소'}
        value={form.roadAddress}
        onChange={handleChange}
        disabled={true}
      />
      <InputBox
        type={'text'}
        name={'jibunAddress'}
        placeholder={'지번주소'}
        value={form.jibunAddress}
        onChange={handleChange}
        disabled={true}
      />

      {/* 가이드 텍스트 (예상 도로명/지번 주소) */}
      {form.guide && <span style={{ color: '#999' }}>{form.guide}</span>}

      <InputBox
        type={'text'}
        name={'detailAddress'}
        placeholder={'상세주소'}
        value={form.detailAddress}
        onChange={handleChange}
      />
      <InputBox
        type={'text'}
        name={'extraAddress'}
        placeholder={'참고사항'}
        value={form.extraAddress}
        onChange={handleChange}
        disabled={true}
      />
    </div>
  );
}
