import TabGroup from '@/shared/ui/tabs/TabGroup';
import HomePage from '../home/HomePage';
import ImageUploader from './ui/ImageUploader';

export default function TestProfilePage() {
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
      <p>router 테스트를 위한</p>
      <p>임시 페이지 입니다.</p>
      <ImageUploader />
      <TabGroup tabGroup={tabGroup} />
    </div>
  );
}
