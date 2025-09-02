import Button from '@/shared/ui/Button';
import IconButton from '@/shared/ui/IconButton';

/**
 * 임시 홈 화면
 * @returns
 */
export default function HomePage() {
  return (
    <div>
      <h1>홈</h1>
      <p>여기에 페이지 콘텐츠를 배치하세요.</p>
      <Button
        label="Hello"
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      />
      <IconButton
        onClick={() => {
          alert('아이콘 버튼 클릭');
        }}
        title={'test'}
        shape={'circle'}
      />
      <div style={{ height: 1200 }} />
    </div>
  );
}
