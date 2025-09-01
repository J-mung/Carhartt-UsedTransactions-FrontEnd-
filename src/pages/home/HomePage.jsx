import Button from '@/shared/ui/Button';

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
        onClickHandler={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      />
      <div style={{ height: 1200 }} />
    </div>
  );
}
