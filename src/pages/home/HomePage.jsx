import Button from '@/shared/ui/buttons/Button';
import { IconButton } from '@/shared/ui/icon_button';
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
        variant={'primary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      >
        <span className={'btn__label'}>Hello world</span>
      </Button>
      <Button
        variant={'secondary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      >
        <span className={'btn__label'}>Hello world</span>
      </Button>
      <Button
        variant={'secondary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
        disabled={true}
      >
        <span className={'btn__label'}>Hello world</span>
      </Button>
      <Button
        variant={'secondary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
        disabled={true}
      >
        <span className={'btn__label'}>Hello world</span>
      </Button>

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
        variant={'primary'}
        onSearch={() => {
          alert('외부 주입 메서드');
        }}
      />

      <div style={{ height: 1200 }} />
    </div>
  );
}
