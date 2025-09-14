import Button from '@/shared/ui/Button';
import { IconButton } from '@/shared/ui/buttons';
import SearchButton from './ui/SearchButton';
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
      {/* shared/ui에 선언된 버튼 */}
      <IconButton
        iconClass={'ic-comment'}
        onClick={() => {
          alert('아이콘 버튼 클릭');
        }}
        title={'test'}
        className={'secondary'}
      />
      {/* (예시) 홈페이지에서만 사용할 버튼 */}
      <SearchButton
        onClick={() => {
          alert('외부 주입 메서드');
        }}
      />
      <SearchButton
        onClick={() => {
          alert('외부 주입 메서드');
        }}
        disabled={true}
      />

      <div style={{ height: 1200 }} />
    </div>
  );
}
