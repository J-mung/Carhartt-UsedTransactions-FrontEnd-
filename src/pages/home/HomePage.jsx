import { Button, IconButton } from '@/shared/ui/buttons';
import SearchButton from './ui/SearchButton';
/**
 * 임시 홈 화면
 * @returns
 */
export default function HomePage() {
  return (
    <div>
      <h1>홈</h1>
      <p className={'text-strong'}>여기에 페이지 콘텐츠를 배치하세요.</p>
      <Button
        variant={'primary'}
        size={'--l'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      >
        <span className={'btn__label text-regular'}>text-regular</span>
      </Button>
      <Button
        variant={'secondary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      >
        <span className={'btn__label text-medium'}>text-medium</span>
      </Button>
      <Button
        variant={'secondary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
        disabled={true}
      >
        <span className={'btn__label text-strong'}>text-strong</span>
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
        variant={'link'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      >
        <span className={'btn__label'}>Hello world</span>
      </Button>
      <Button
        variant={'link'}
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
      <SearchButton
        variant={'primary'}
        onSearch={() => {
          alert('외부 주입 메서드');
        }}
        disabled={true}
      />

      <div style={{ height: 1200 }} />
    </div>
  );
}
