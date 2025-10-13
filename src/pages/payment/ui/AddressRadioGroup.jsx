import { useAddresses } from '@/entities/user/hooks/useAddresses';
import { carHarttApi } from '@/shared/api/axios';
import RadioGroup from '@/shared/ui/Radio';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useEffect, useState } from 'react';

export default function AddressRadioGroup({ userId = '' }) {
  const { openModal } = useModal();
  const { addresses, loading, error, refresh } = useAddresses();
  const [curAddress, setCurAddress] = useState(undefined);

  // 주소지 조회
  useEffect(() => {
    // 주소지 조회 성공 시
    if (!loading && addresses.length > 0) {
      setCurAddress({ ...addresses[0] });
    }
  }, [loading, addresses]);

  if (loading)
    return (
      <div>
        <span className={'text-regular'}>주소 불러오는 중...</span>
      </div>
    );
  if (error)
    return (
      <div>
        <span className={'text-regular'}>주소를 불러올 수 없습니다.</span>
      </div>
    );

  const handleClickDelete = (addr) => {
    carHarttApi({
      method: 'DELETE',
      url: `/v1/orders/address/${addr.key}`,
    })
      .then((response) => {
        const { success, data, meta } = response;
        if (success) {
          // window.location.reload();
          refresh();
        }
      })
      .catch((err) => {
        console.error(`배송지 삭제 실패 : ${err}`);
        openModal(Modal, {
          title: '배송지 삭제 실패',
          children: (
            <span className={'text-regular'}>
              배송지 삭제에 실패 했습니다. {err}
            </span>
          ),
        });
      });
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
          label: '삭제',
          variant: 'danger-primary',
          onClick: () => {
            handleClickDelete(addr);
          },
        },
      ],
    });
  };

  const customOptions = () => {
    return addresses.map((_addr) => ({
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

  return (
    <RadioGroup
      label={'배송지'}
      name={'addressList'}
      value={curAddress?.value}
      onChange={(e) => {
        const selected = addresses.find((_addr) => _addr.key === e.target.key);
        setCurAddress(selected);
      }}
      variant={'radio'}
      options={customOptions()}
    />
  );
}
