import { Button, IconButton } from '@/shared/ui/buttons';
import SearchButton from './ui/SearchButton';
import InputBox from '@/shared/ui/InputBox';
import { useState } from 'react';

/**
 * 임시 홈 화면
 * @returns
 */
export default function HomePage() {
  // state 예시 - inputBox
  const [searchValue, setSearchValue] = useState('');
  const [profileName, setProfileName] = useState('');
  const [price, setPrice] = useState('');
  const [totalLength, setTotalLength] = useState('');

  return (
    <div>
      <h1>홈</h1>
      <p className={'text-strong'}>여기에 페이지 콘텐츠를 배치하세요.</p>
      <Button
        variant={'standard-primary'}
        size={'--l'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
        label={'standard-primary'}
      />
      <Button
        variant={'standard-secondary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      >
        <span className={'btn__label h5-regular'}>custom text-medium</span>
      </Button>
      <Button
        variant={'standard-secondary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
        disabled={true}
      />
      <Button
        variant={'standard-secondary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
        disabled={true}
      >
        <span className={'btn__label'}>Hello world</span>
      </Button>
      <Button
        variant={'standard-link'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      >
        <span className={'btn__label'}>Hello world</span>
      </Button>
      <Button
        variant={'standard-link'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
        disabled={true}
      >
        <span className={'btn__label'}>Hello world</span>
      </Button>
      <Button
        variant={'danger-primary'}
        size={'--l'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      />
      <Button
        variant={'danger-secondary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      >
        <span className={'btn__label text-medium'}>text-medium</span>
      </Button>
      <Button
        variant={'danger-secondary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
        disabled={true}
      >
        <span className={'btn__label text-strong'}>text-strong</span>
      </Button>
      <Button
        variant={'danger-secondary'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
        disabled={true}
      >
        <span className={'btn__label'}>Hello world</span>
      </Button>
      <Button
        variant={'danger-link'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      >
        <span className={'btn__label'}>Hello world</span>
      </Button>
      <Button
        variant={'danger-link'}
        size={'--l'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
        disabled={true}
      >
        <span className={'btn__label'}>Hello world</span>
      </Button>
      <Button
        variant={'ghost-primary'}
        size={'--l'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      />
      <Button
        variant={'ghost-secondary'}
        size={'--m'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      />
      <Button
        variant={'ghost-link'}
        size={'--s'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
      />
      <Button
        variant={'ghost-link'}
        size={'--s'}
        onClick={() => {
          alert('외부에서 주입한 함수, 버튼 클릭 함');
        }}
        disabled={true}
      />

      {/* shared/ui에 선언된 버튼 */}
      <IconButton
        iconClass={'ic-comment'}
        onClick={() => {
          alert('아이콘 버튼 클릭');
        }}
        title={'test'}
        variant={'standard-secondary'}
      />
      {/* (예시) 홈페이지에서만 사용할 버튼 */}
      <SearchButton
        variant={'standard-primary'}
        onSearch={() => {
          alert('외부 주입 메서드');
        }}
      />
      <SearchButton
        variant={'standard-primary'}
        onSearch={() => {
          alert('외부 주입 메서드');
        }}
        disabled={true}
      />

      {/* shared/ui에 선언된 inputbox */}
      {/* (예시) 검색 Input */}
      <InputBox
        label="검색"
        name="search"
        placeholder="상품을 검색하세요"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        variant="search"
        iconClass="ic-search"
        iconPosition="right"
        clear={true}
      />
      <InputBox
        name="search"
        placeholder="상품을 검색하세요"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        variant="search"
        clear={true}
        disabled={true}
      />
      {/* (예시) 사용자 이름 input */}
      <InputBox
        label="프로필명"
        name="profilename"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        iconClass="ic-user"
        iconPosition="left"
        maxLength={10}
        clear={true}
        required={true}
      />
      {/* (예시) 가격 input */}
      <InputBox
        type="number"
        label="가격"
        name="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        variant="number"
        suffix="원"
      />
      {/* (예시) 사이즈 input */}
      <InputBox
        type="number"
        label="사이즈"
        name="totallength"
        placeholder="72"
        value={totalLength}
        onChange={(e) => setTotalLength(e.target.value)}
        variant="number"
        prefix="총장"
        suffix="cm"
      />
      <InputBox placeholder="72" prefix="총장" suffix="cm" disabled={true} />
      <InputBox
        label="에러 예시"
        value="잘못된 값 placeholder"
        prefix="예시"
        error={true}
      />

      <div style={{ height: 1200 }} />
    </div>
  );
}
