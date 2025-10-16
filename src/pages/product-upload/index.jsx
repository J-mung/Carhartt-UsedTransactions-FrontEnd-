import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InputBox from '@/shared/ui/InputBox';
import TextArea from '@/shared/ui/TextArea';
import SelectBox from '@/shared/ui/SelectBox';
import RadioGroup from '@/shared/ui/Radio';
import Button from '@/shared/ui/buttons/Button';
import ImageUploadSection from './ui/ImageUploadSection';
import './productUploadPage.scss';

/**
 * 상품 등록/수정 페이지
 * - /product/new → 판매글 작성 (작성/등록 모드)
 * - /product/:itemId/edit → 게시글 수정 (편집 모드)
 */
export default function ProductUploadPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!itemId;

  // Form state
  const [productName, setProductName] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [images, setImages] = useState([]);

  // 상품 사이즈 (S, M, L, etc)
  const [productSize, setProductSize] = useState('');

  // 실측 정보
  const [totalLength, setTotalLength] = useState('');
  const [sleeve, setSleeve] = useState('');
  const [shoulder, setShoulder] = useState('');
  const [chest, setChest] = useState('');

  // 상품 정보 - 설명, 가격, 직거래 가능
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [directTrade, setDirectTrade] = useState('yes');

  // 메인 카테고리
  const mainCategories = [
    { value: '1', label: '산타페 OG' },
    { value: '2', label: '산타페 WIP OG' },
    { value: '3', label: '액티브 OG' },
    { value: '4', label: '액티브 WIP OG' },
    { value: '5', label: '디트로이트 OG' },
    { value: '6', label: '디트로이트 WIP OG' },
  ];

  // Subcategories - 선택된 메인 카테고리에 따라 변경
  // API call로 변경 예정
  const getSubCategories = (mainCatId) => {
    const subCategoryMap = {
      2: [
        { value: '10', label: 'J14' },
        { value: '11', label: 'J102' },
      ],
      3: [
        { value: '12', label: 'J68' },
        { value: '13', label: 'J130' },
        { value: '14', label: 'J140' },
      ],
      5: [
        { value: '15', label: 'J01' },
        { value: '16', label: 'J97' },
        { value: '17', label: 'J001' },
      ],
    };
    return subCategoryMap[mainCatId] || [];
  };

  // 사이즈 옵션 (S, M, L, XL)
  const sizeOptions = [
    { value: 'xs', label: 'XS' },
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
    { value: 'xl', label: 'XL' },
    { value: 'xxl', label: 'XXL' },
  ];

  // 직거래 가능 옵션
  const directTradeOptions = [
    { key: 'yes', value: 'yes', label: '가능' },
    { key: 'no', value: 'no', label: '불가능' },
  ];

  // Handle main category change
  const handleMainCategoryChange = (e) => {
    setMainCategory(e.target.value);
    setSubCategory('');
  };

  // Handle form submission - temporary placeholder
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!productName.trim()) {
      console.log('상품명을 입력해주세요.');
      return;
    }
    if (!mainCategory || !subCategory) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (images.length === 0) {
      alert('최소 1개의 이미지를 업로드해주세요.');
      return;
    }
    if (!price) {
      alert('가격을 입력해주세요.');
      return;
    }

    // Prepare form data
    const formData = {
      name: productName,
      category_id: parseInt(subCategory),
      product_size: productSize,
      sizes: {
        total_length: totalLength ? parseInt(totalLength) : null,
        sleeve: sleeve ? parseInt(sleeve) : null,
        shoulder: shoulder ? parseInt(shoulder) : null,
        chest: chest ? parseInt(chest) : null,
      },
      description: description.trim(),
      item_price: parseInt(price),
      direct_trade: directTrade === 'yes',
      // image_paths will be added after S3 upload
    };
  };

  return (
    <div className="product-form">
      <h1 className="product-form__title">
        {!isEditMode ? '판매글 작성' : '게시글 수정'}
      </h1>

      <form className="product-form__form" onSubmit={handleSubmit}>
        {/* 상품 이미지 */}
        <ImageUploadSection
          images={images}
          onImagesChange={setImages}
          maxImages={12}
        />

        {/* 상품명 */}
        <InputBox
          label="상품명"
          name="productName"
          placeholder="상품명을 입력하세요"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required={true}
        />

        {/* 카테고리 */}
        <div className="product-form__category">
          <SelectBox
            label="카테고리"
            name="mainCategory"
            placeholder="Default"
            value={mainCategory}
            onChange={handleMainCategoryChange}
            options={mainCategories}
            required={true}
          />
          {getSubCategories(mainCategory).length > 0 && (
            <SelectBox
              name="subCategory"
              placeholder="Default"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              options={getSubCategories(mainCategory)}
              disabled={!mainCategory}
              required={true}
            />
          )}
        </div>

        {/* 사이즈 */}
        <SelectBox
          label="사이즈"
          name="productSize"
          placeholder="Choose a size"
          value={productSize}
          onChange={(e) => setProductSize(e.target.value)}
          options={sizeOptions}
        />

        {/* 실측 정보 */}
        <div className="product-form__measurements">
          <label className="product-form__section-title">실측 정보</label>
          <div className="product-form__measurement-inputs">
            <InputBox
              name="totalLength"
              variant="number"
              placeholder="0"
              value={totalLength}
              onChange={(e) => setTotalLength(e.target.value)}
              prefix="총장"
              suffix="cm"
            />
            <InputBox
              name="sleeve"
              variant="number"
              placeholder="0"
              value={sleeve}
              onChange={(e) => setSleeve(e.target.value)}
              prefix="소매"
              suffix="cm"
            />
            <InputBox
              name="shoulder"
              variant="number"
              placeholder="0"
              value={shoulder}
              onChange={(e) => setShoulder(e.target.value)}
              prefix="어깨"
              suffix="cm"
            />
            <InputBox
              name="chest"
              variant="number"
              placeholder="0"
              value={chest}
              onChange={(e) => setChest(e.target.value)}
              prefix="가슴"
              suffix="cm"
            />
          </div>
        </div>

        {/* 상품 설명 */}
        <TextArea
          label="상품 설명"
          name="description"
          variant="product"
          placeholder="상품에 대한 설명을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          required={true}
        />

        {/* 가격 */}
        <InputBox
          label="가격"
          name="price"
          variant="number"
          placeholder="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          suffix="원"
          required={true}
        />

        {/* 직거래 가능 여부 */}
        <RadioGroup
          label="직거래 가능"
          name="directTrade"
          options={directTradeOptions}
          defaultKey="yes"
          value={directTrade}
          onChange={(e) => setDirectTrade(e.target.value)}
          variant="radio"
        />

        {/* Submit Button */}
        <div className="product-form__submit">
          <Button type="submit" label="등록하기" variant="standard-primary" />
        </div>
      </form>
    </div>
  );
}
