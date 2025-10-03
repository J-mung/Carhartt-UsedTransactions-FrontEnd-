import { Button, IconButton } from '@/shared/ui/buttons';
import Dropdown from '@/shared/ui/Dropdown';
import InputBox from '@/shared/ui/InputBox';
import TextArea from '@/shared/ui/TextArea';
import SelectBox from '@/shared/ui/SelectBox';
import RadioGroup from '@/shared/ui/Radio';
import { useState } from 'react';
import SearchButton from './ui/SearchButton';

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

  // state 예시 - textArea
  const [textAreaText, setTextAreaText] = useState('');
  const [message, setMessage] = useState('');

  // state 예시 - textArea
  const [selectedCategory, setSelectedCategory] = useState('');
  const selectionOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
  ];
  const dupeSelectionOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option1', label: 'Option 2' },
    { value: 'option2', label: 'Option 3' },
  ];

  const dropdownDefault = [1, 2, 3, 4, 5].map((_num) => {
    return {
      key: _num,
      value: `test-${_num}`,
    };
  });
  const dropdownScroll = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_num) => {
    return {
      key: _num,
      value: `test-${_num}`,
    };
  });
  const dropdownDuplication = [1, 1, 2, 3, 4, 5].map((_num) => {
    return {
      key: _num,
      value: `test-${_num}`,
    };
  });

  // state 예시 - radio
  const [radioOption, setRadioOption] = useState('option1');
  const [currentPage, setCurrentPage] = useState('1');

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
      <Dropdown options={dropdownDefault} disabled={false} />
      <Dropdown options={dropdownScroll} disabled={false} />
      <Dropdown options={dropdownDuplication} disabled={false} />

      {/* shared/ui에 선언된 inputbox */}
      <div style={{ marginTop: 50 }}>
        {/* (예시) 검색 Input */}
        <InputBox
          label="검색"
          name="search"
          variant="search"
          placeholder="상품을 검색하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          iconClass="ic-search"
          iconPosition="right"
          clear={true}
        />
        <InputBox
          variant="search"
          size="--s"
          placeholder="상품을 검색하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          iconClass="ic-search"
          iconPosition="right"
          clear={true}
          disabled={true}
        />
        <InputBox
          variant="search"
          placeholder="상품을 검색하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          iconClass="ic-search"
          iconPosition="right"
          clear={true}
          disabled={true}
        />
        <InputBox
          variant="search"
          size="--l"
          placeholder="상품을 검색하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          iconClass="ic-search"
          iconPosition="right"
          clear={true}
          disabled={true}
        />
        {/* (예시) 사용자 이름 input */}
        <InputBox
          label="프로필명"
          name="profilename"
          size="--s"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          iconClass="ic-user"
          iconPosition="left"
          maxLength={10}
          clear={true}
          required={true}
        />
        <InputBox
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          iconClass="ic-user"
          iconPosition="left"
          clear={true}
          required={true}
        />
        <InputBox
          size="--l"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          iconClass="ic-user"
          iconPosition="left"
          clear={true}
          required={true}
        />
        {/* (예시) 가격 input */}
        <InputBox
          label="가격"
          type="number"
          name="price"
          variant="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          suffix="원"
        />
        {/* (예시) 사이즈 input */}
        <InputBox
          label="사이즈"
          type="number"
          name="totallength"
          variant="number"
          placeholder="72"
          value={totalLength}
          onChange={(e) => setTotalLength(e.target.value)}
          prefix="총장"
          suffix="cm"
        />
        <InputBox
          size="--s"
          placeholder="72"
          value={totalLength}
          onChange={(e) => setTotalLength(e.target.value)}
          prefix="총장"
          suffix="cm"
          disabled={true}
        />
        <InputBox
          placeholder="72"
          value={totalLength}
          onChange={(e) => setTotalLength(e.target.value)}
          prefix="총장"
          suffix="cm"
          disabled={true}
        />
        <InputBox
          size="--l"
          placeholder="72"
          value={totalLength}
          onChange={(e) => setTotalLength(e.target.value)}
          prefix="총장"
          suffix="cm"
          disabled={true}
        />
        <InputBox
          size="--s"
          label="에러 예시"
          value="잘못된 값 placeholder"
          prefix="예시"
          error={true}
        />
        <InputBox value="잘못된 값 placeholder" prefix="예시" error={true} />
        <InputBox
          size="--l"
          value="잘못된 값 placeholder"
          prefix="예시"
          error={true}
        />
      </div>

      {/* shared/ui에 선언된 TextArea */}
      <div style={{ marginTop: 50 }}>
        <TextArea
          label="TextArea"
          name="textArea"
          variant="product"
          size="--s"
          placeholder="Placeholder Text"
          value={textAreaText}
          onChange={(e) => setTextAreaText(e.target.value)}
          maxLength={500}
          required={true}
        />
        <TextArea
          placeholder="Placeholder Text"
          value={textAreaText}
          onChange={(e) => setTextAreaText(e.target.value)}
          maxLength={500}
          disabled={true}
        />
        <TextArea
          label="TextArea"
          size="--l"
          placeholder="Placeholder Text"
          value={textAreaText}
          onChange={(e) => setTextAreaText(e.target.value)}
          maxLength={500}
          required={true}
          error={true}
        />
        <TextArea
          label="메세지"
          name="messageText"
          size="--s"
          placeholder="Message Placeholder"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* shared/ui에 선언된 SelectBox */}
      <div style={{ marginTop: 50 }}>
        <SelectBox
          label="SelectBox"
          name="category"
          placeholder="Placeholder Text"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={selectionOptions}
          required={true}
          size="--s"
        />
        <SelectBox
          placeholder="Placeholder Text"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={selectionOptions}
        />
        <SelectBox
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={selectionOptions}
          size="--l"
        />
        <SelectBox disabled={true} size="--s" />
        <SelectBox
          label="SelectBox"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={selectionOptions}
          error={true}
          errorMessage="Error Message"
        />
        <SelectBox options={dupeSelectionOptions} />
      </div>

      {/* shared/ui에 선언된 Radio */}
      {/* Radio variant */}
      <RadioGroup
        label="Radio Example"
        name="radioExample"
        options={[
          {
            key: 'option1',
            value: 'option1',
            label: 'Option 1',
          },
          {
            key: 'option2',
            value: 'option2',
            label: 'Option 2',
          },
          {
            key: 'option3',
            value: 'option3',
            label: 'Option 3',
            disabled: true,
          },
        ]}
        defaultKey="option1"
        value={radioOption}
        onChange={(e) => {
          setRadioOption(e.target.value);
        }}
        variant="radio"
        required={true}
      />

      <RadioGroup
        name="errorTestRadio"
        options={[
          { key: 'option1', value: 'option1', label: 'Error1' },
          { key: 'option1', value: 'option2', label: 'Error2' },
        ]}
        value={radioOption}
        onChange={(e) => setRadioOption(e.target.value)}
      />
      <RadioGroup
        label="Simple String Options"
        options={['Option 1', 'Option 2', 'Option 3']}
        defaultKey="Option 1"
        value={radioOption}
        onChange={(e) => setRadioOption(e.target.value)}
      />
      {/* Button variant */}
      <RadioGroup
        label="Button Example"
        name="buttonExample"
        options={[
          {
            key: 'option1',
            value: 'option1',
            label: 'Option 1',
          },
          {
            key: 'option2',
            value: 'option2',
            label: 'Option 2',
          },
          {
            key: 'option3',
            value: 'option3',
            label: 'Option 3',
            disabled: true,
          },
        ]}
        defaultKey="option1"
        value={radioOption}
        onChange={(e) => {
          setRadioOption(e.target.value);
        }}
        variant="button"
        required={true}
      />
      <RadioGroup
        name="errorTestButton"
        options={[
          { key: 'option1', value: 'option2', label: 'Error1' },
          {
            key: 'option2',
            value: 'option2',
            label: 'Error2',
          },
        ]}
        value={radioOption}
        onChange={(e) => setRadioOption(e.target.value)}
        variant="button"
        size="--s"
      />
      {/* Pagination */}
      <RadioGroup
        name="pagination"
        options={[
          { key: '1', value: '1' },
          { key: '2', value: '2' },
          { key: '3', value: '3' },
          { key: '4', value: '4' },
          { key: '5', value: '5' },
          { key: '6', value: '6' },
          { key: '7', value: '7' },
        ]}
        value={currentPage}
        onChange={(e) => {
          setCurrentPage(e.target.value);
        }}
        variant="button"
        showNavigation={true}
        size=""
      />

      <div style={{ height: 1200 }} />
    </div>
  );
}
