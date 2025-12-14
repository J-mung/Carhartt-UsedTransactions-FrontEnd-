import {
  useAddresses,
  useDeleteAddress,
} from '@/entities/user/hooks/useAddresses';
import { Button } from '@/shared/ui/buttons';
import RadioGroup from '@/shared/ui/Radio';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useEffect, useState } from 'react';
import AddressAddForm from './AddressAddForm';
import './paymentForm.scss';

export default function AddressRadioGroup({}) {
  const { openModal } = useModal();
  const memberId =
    JSON.parse(sessionStorage.getItem('user_info') || '{}')?.memberId || '';
  // 배송지 조회 react query
  const { data: addresses, isLoading, error, refetch } = useAddresses(memberId);
  // Radio 그룹에서 선택된 현재 배송지
  const [curAddress, setCurAddress] = useState(undefined);
  const [openAddressAddForm, setOpenAddressAddForm] = useState(false);
  // 배송지 삭제 mutation query
  const deleteAddressMutation = useDeleteAddress(memberId);

  // 주소지 조회
  useEffect(() => {
    // 주소지 조회 성공 시
    if (addresses && addresses.count > 0) {
      setCurAddress(addresses.list[0]);
    }
  }, [addresses]);

  const handleDelete = (addr) => {
    const { mutateAsync: deleteAddress, isPending } = deleteAddressMutation;

    openModal(Modal, {
      title: '배송지 삭제',
      children: (
        <span className={'text-strong'}>
          {addr.alias} 주소를 삭제 하겠습니까?
        </span>
      ),
      buttons: [
        {
          label: isPending ? '삭제 중...' : '삭제',
          variant: 'danger-primary',
          onClick: () => deleteAddress(addr.key),
        },
      ],
    });
  };

  const normalizeAddress = (addr) => {
    const { address_id, address_name, zip, road_address, detail_address } =
      addr;
    return {
      key: address_id ?? '오류',
      value: `${road_address} ${detail_address}`,
      alias: address_name ?? '오류',
      label: `${address_name} : ${road_address} ${detail_address}`,
    };
  };

  const customOptions = () => {
    return (addresses.list ?? []).map((_addr) => ({
      ..._addr,
      label: (
        <div className={'radio__button-label-with-delete'}>
          <span
            className={'radio__button_label text-regular'}
          >{`${_addr.alias}: ${_addr.value}`}</span>
          {/*IconButton 컴포넌트 대체 가능해 보임*/}
          <button
            type={'button'}
            className={'radio-delete-btn'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete(_addr);
            }}
          >
            X
          </button>
        </div>
      ),
    }));
  };

  const drawContent = () => {
    if (isLoading) {
      return (
        <div className={'flex'} style={{ minHeight: '86px' }}>
          <span className={'text-strong m-auto'}>주소 불러오는 중...</span>
        </div>
      );
    }
    if (error) {
      return (
        <div className={'flex'} style={{ minHeight: '86px' }}>
          <span className={'text-strong m-auto'}>
            주소를 불러올 수 없습니다.
          </span>
        </div>
      );
    }
    return (
      <>
        <div className={'mb-3'}>
          <RadioGroup
            label={''}
            name={'addressList'}
            value={curAddress?.value}
            onChange={(e) => {
              const selected = addresses.list.find(
                (_addr) => _addr.key === e.target.key
              );
              setCurAddress(selected);
            }}
            variant={'radio'}
            options={customOptions()}
            optionDirection={'column'}
          />
        </div>
        <div className={'ml-auto'}>
          <Button
            label={openAddressAddForm ? '배송지 추가 접기' : '배송지 추가 등록'}
            variant={'standard-link'}
            onClick={() => {
              setOpenAddressAddForm((prev) => !prev);
            }}
          />
        </div>
        {openAddressAddForm ? <AddressAddForm /> : <div></div>}
      </>
    );
  };

  return (
    <>
      <span className={'h4 mb-2'}>배송지</span>
      <div className={'content--wrapper mt-2 mb-4'}>{drawContent()}</div>
    </>
  );
}
