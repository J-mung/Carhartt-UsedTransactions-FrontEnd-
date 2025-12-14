import { useEnrollAddress } from '@/entities/user/hooks/useAddresses';
import useDaumPostcodeModal from '@/entities/user/hooks/useDaumPostcodeModal';
import { Button } from '@/shared/ui/buttons';
import { useCallback, useState } from 'react';
import AddressAddFormInputBox from './AddressAddFormInputBox';

export default function AddressAddForm() {
  const memberId =
    JSON.parse(sessionStorage.getItem('user_info') || '{}')?.memberId || '';
  // 배송지 등록 query mutation
  const enrollAddressMutation = useEnrollAddress(memberId);
  // 주소 등록 신청서 초기값
  const initialForm = {
    alias: '',
    recipient: '',
    zip: '',
    roadAddress: '',
    jibunAddress: '',
    detailAddress: '',
    addressType: '',
    buildingName: '',
    guide: '',
    raw: '',
  };
  // 주소 등록 신청서 상태
  const [form, setForm] = useState(initialForm);
  const { openPostcode } = useDaumPostcodeModal();

  // 주소 검색 모달 검색 결과 handler
  const handleSearchAddress = useCallback(async () => {
    const result = await openPostcode();
    if (!result) return;

    setForm((prev) => ({
      ...prev,
      zip: result.zip,
      roadAddress: result.roadAddress,
      jibunAddress: result.jibunAddress,
      addressType: result.addressType,
      buildingName: result.buildingName,
      guide: result.roadAddress || result.jibunAddress || '',
    }));
  }, []);

  // 신청서 값 변경 handler
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
        margin: '1rem auto 0rem auto',
      }}
    >
      <AddressAddFormInputBox
        type={'text'}
        name={'alias'}
        label={'배송지명'}
        placeholder={'예) 우리집'}
        value={form.alias}
        onChange={handleChange}
      />
      <AddressAddFormInputBox
        type={'text'}
        name={'recipient'}
        label={'수령인'}
        placeholder={'이름'}
        value={form.recipient}
        onChange={handleChange}
        required={true}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <AddressAddFormInputBox
          type={'text'}
          name={'zip'}
          label={'배송지'}
          placeholder={'우편번호'}
          value={form.zip}
          onChange={handleChange}
          required={true}
        />
        <div style={{ display: 'flex', marginTop: 'auto', height: '40px' }}>
          <Button
            label={'우편번호 찾기'}
            variant={'standard-secondary'}
            onClick={handleSearchAddress}
          />
        </div>
      </div>

      <AddressAddFormInputBox
        type={'text'}
        name={form.addressType === 'R' ? 'roadAddress' : 'jibunAddress'}
        placeholder={'주소'}
        value={form.addressType === 'R' ? form.roadAddress : form.jibunAddress}
        onChange={handleChange}
        disabled={true}
        required={true}
      />
      <AddressAddFormInputBox
        type={'text'}
        name={'detailAddress'}
        placeholder={'상세주소'}
        value={form.detailAddress}
        onChange={handleChange}
        required={true}
      />

      {/* 가이드 텍스트 (예상 도로명/지번 주소) */}
      {form.guide && <span style={{ color: '#999' }}>{form.guide}</span>}

      <Button
        label={'등록'}
        variant={'standard-primary'}
        onClick={() => {
          console.log('todo');
          const { mutateAsync: enrollAddress } = enrollAddressMutation;
          enrollAddress(form);
        }}
      />
    </div>
  );
}
