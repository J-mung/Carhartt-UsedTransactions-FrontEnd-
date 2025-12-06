import InputBox from '@/shared/ui/InputBox';

/**
 * 배송지 등록 신청서의 InputBox
 *  - 공통 컴포넌트 InputBox를 Wrapping
 * @param {*} param0
 * @returns
 */
export default function AddressAddFormInputBox({
  type = '',
  name = '',
  label = '',
  placeholder = '',
  value = '',
  onChange = '',
  required = false,
  disabled = false,
}) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ margin: '-1rem auto', flex: 1 }}>
        <InputBox
          type={type}
          name={name}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
