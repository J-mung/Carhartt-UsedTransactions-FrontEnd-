import {
  useAddresses,
  useRemoveAddresses,
} from '@/entities/user/hooks/useAddresses';
import { Button } from '@/shared/ui/buttons';
import RadioGroup from '@/shared/ui/Radio';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useEffect, useState } from 'react';
import './paymentForm.scss';

export default function AddressRadioGroup({ userId = '' }) {
  const { openModal } = useModal();
  const { data: addresses, isLoading, isError, refetch } = useAddresses();
  const removeAddress = useRemoveAddresses();
  const [curAddress, setCurAddress] = useState(undefined);

  // 주소지 조회
  useEffect(() => {
    // 주소지 조회 성공 시
    if (!isLoading && addresses?.length > 0) {
      setCurAddress(addresses[0]);
    }
  }, [isLoading, addresses]);

  if (isLoading)
    return (
      <div>
        <span className={'text-regular'}>주소 불러오는 중...</span>
      </div>
    );
  if (isError)
    return (
      <div>
        <span className={'text-regular'}>주소를 불러올 수 없습니다.</span>
      </div>
    );

  const handleClickDelete = (addr) => {
    removeAddress.mutate(addr.key);
  };

  const handleDelete = (addr) => {
    openModal(Modal, {
      title: '배송지 삭제',
      children: (
        <span className={'text-strong'}>
          {addr.alias} 주소를 삭제 하겠습니까?
        </span>
      ),
      buttons: [
        {
          label: removeAddress.isPending ? '삭제 중...' : '삭제',
          variant: 'danger-primary',
          onClick: () => handleClickDelete(addr),
        },
      ],
    });
  };

  const normalizeAddress = (addr) => {
    const { address_id, address_name, zip_code, road_address, detail_address } =
      addr;
    return {
      key: address_id ?? '오류',
      value: `${road_address} ${detail_address}`,
      alias: address_name ?? '오류',
      label: `${address_name} : ${road_address} ${detail_address}`,
    };
  };

  const customOptions = () => {
    return addresses.map((_addr) => {
      const normalized = normalizeAddress(_addr);
      return {
        ...normalized,
        label: (
          <div className={'radio__button-label-with-delete'}>
            <span className={'radio__button_label text-regular'}>
              {`${normalized.alias}: ${normalized.value}`}
            </span>
            <button
              type="button"
              className="radio-delete-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(normalized);
              }}
            >
              X
            </button>
          </div>
        ),
      };
    });
  };

  return (
    <>
      <span className={'h4 mb-2'}>배송지</span>
      <div className={'content--wrapper mt-2 mb-4'}>
        <div className={'mb-3'}>
          <RadioGroup
            label={''}
            name={'addressList'}
            value={curAddress?.value}
            onChange={(e) => {
              const selected = addresses.find(
                (_addr) => _addr.key === e.target.key
              );
              setCurAddress(selected);
            }}
            variant={'radio'}
            options={customOptions()}
          />
        </div>
        <div className={'ml-auto'}>
          <Button
            label={'배송지 추가 등록'}
            variant={'standard-link'}
            onClick={() => {
              console.log('배송지 추가 등록 클릭');
            }}
          />
        </div>
      </div>
    </>
  );
}
