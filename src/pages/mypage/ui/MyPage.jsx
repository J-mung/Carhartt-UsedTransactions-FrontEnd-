import HomePage from '@/pages/home/HomePage';
import ImageUploader from '@/pages/mypage/ui/ImageUploader';
import { Button } from '@/shared/ui/buttons';
import TabGroup from '@/shared/ui/tabs/TabGroup';
import ThemeToggle from '@/shared/ui/ThemeToggle';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';

export default function MyPage() {
  const { openModal } = useModal();

  // 외부에서 정의한 Layout 컴포넌트
  function CardLayout({ children }) {
    return (
      <div
        className={'card-layout'}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#fff',
        }}
      >
        {children}
      </div>
    );
  }
  const handleOpenInnerTestModal = () => {
    openModal(Modal, {
      title: '중첩 모달 테스트',
      children: <p>중첩 모달 테스트 중입니다.</p>,
    });
  };
  const modalTemplate = (
    <>
      <span className={'text-regular'}>
        테스트 모달입니다. 추가 모달을 열 수도 있고, 현재 모달을 닫을 수도
        있습니다.
      </span>
      <Button
        label={'추가 모달'}
        variant={'standard-secondary'}
        onClick={handleOpenInnerTestModal}
      />
    </>
  );
  const handleOpenTestModal = () => {
    openModal(Modal, {
      title: '테스트 모달',
      children: modalTemplate,
      buttons: [
        {
          label: '확인',
          variant: 'standard-primary',
          onClick: () => console.log('확인 버튼 클릭'),
        },
      ],
    });
  };

  const tabGroup = [
    {
      key: 'info',
      label: '회원 정보',
      content: <HomePage />,
      // disabled: true,
    },
    {
      key: 'activity',
      label: '활동 내역',
      content: <div>활동 내역 내용</div>,
      disabled: true,
    },
    {
      key: 'security',
      label: '보안 설정',
      content: <div>보안 설정 내용</div>,
      // disabled: true,
    },
  ];

  return (
    <div>
      <ThemeToggle />
      <Button
        label={'테스트 모달 열기'}
        variant={'primary-standard'}
        onClick={handleOpenTestModal}
      />
      <ImageUploader />
      <TabGroup tabGroup={tabGroup} Layout={CardLayout} />
    </div>
  );
}
