import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useProductDetail,
  useCategories,
} from '@/entities/product/hooks/useProduct';
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  usePresignedUrl,
  uploadToS3,
} from '@/entities/product/hooks/useProductForm';
import InputBox from '@/shared/ui/InputBox';
import TextArea from '@/shared/ui/TextArea';
import SelectBox from '@/shared/ui/SelectBox';
import RadioGroup from '@/shared/ui/Radio';
import Button from '@/shared/ui/buttons/Button';
import ImageUploadSection from './ui/ImageUploadSection';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import './ui/productUploadPage.scss';

// 상품 등록/수정 페이지
// product/new → 판매글 작성 (작성/등록 모드)
// product/:itemId/edit → 게시글 수정 (편집 모드)
export default function ProductUploadPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const isEditMode = !!itemId;
  const formRef = useRef(null);

  // API Hooks
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: existingProduct, isLoading: productLoading } =
    useProductDetail(itemId);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const getPresignedUrl = usePresignedUrl();

  // Form state
  const [productName, setProductName] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // 수정 모드 - 기존 상품 데이터 로드
  useEffect(() => {
    if (isEditMode && existingProduct) {
      setProductName(existingProduct.item_name || '');
      setDescription(existingProduct.description || '');
      setPrice(existingProduct.item_price?.toString() || '');
      setDirectTrade(existingProduct.direct_trade ? 'yes' : 'no');
      setProductSize(existingProduct.product_size || '');

      // 카테고리 설정
      if (existingProduct.category_ids?.length > 0) {
        setMainCategory(existingProduct.category_ids[0]?.toString() || '');
        if (existingProduct.category_ids.length > 1) {
          setSubCategory(existingProduct.category_ids[1]?.toString() || '');
        }
      }

      // 사이즈 정보 설정
      if (existingProduct.sizes) {
        setTotalLength(existingProduct.sizes.total_length?.toString() || '');
        setSleeve(existingProduct.sizes.sleeve?.toString() || '');
        setShoulder(existingProduct.sizes.shoulder?.toString() || '');
        setChest(existingProduct.sizes.chest?.toString() || '');
      }

      // 이미지 설정
      if (existingProduct.images?.length > 0) {
        const imageData = existingProduct.images.map((img) => ({
          file: null,
          preview: img.image_url,
          overSize: false,
          isExisting: true,
          imageId: img.image_id,
        }));
        setImages(imageData);
      }
    }
  }, [isEditMode, existingProduct]);

  // 1 depth 카테고리 옵션
  const mainCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    const rootCategory = categories[0];
    if (!rootCategory?.children) return [];

    return rootCategory.children.map((cat) => ({
      value: cat.category_id.toString(),
      label: cat.category_name,
    }));
  }, [categories]);

  // 2 depth 카테고리 옵션
  const subCategories = useMemo(() => {
    if (!categories || !mainCategory) return [];

    const rootCategory = categories[0];
    if (!rootCategory?.children) return [];

    const mainCat = rootCategory.children.find(
      (cat) => cat.category_id.toString() === mainCategory
    );

    if (!mainCat?.children || mainCat.children.length === 0) return [];

    return mainCat.children.map((cat) => ({
      value: cat.category_id.toString(),
      label: cat.category_name,
    }));
  }, [categories, mainCategory]);

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

  // 핸들러 - 카테고리 변경
  const handleMainCategoryChange = (e) => {
    setMainCategory(e.target.value);
    setSubCategory('');
  };

  // 핸들러 - 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];

    if (!productName.trim()) {
      missingFields.push('상품명');
    }
    if (!mainCategory) {
      missingFields.push('메인 카테고리');
    }
    if (subCategories.length > 0 && !subCategory) {
      missingFields.push('서브 카테고리');
    }
    if (images.length === 0) {
      missingFields.push('상품 이미지');
    }
    if (!description.trim()) {
      missingFields.push('상품 설명');
    }
    if (!price) {
      missingFields.push('가격');
    }

    if (missingFields.length > 0) {
      alert(`다음 항목을 입력해주세요:\n\n${missingFields.join('\n')}`);
      return;
    }

    alert(isEditMode ? '상품 수정 완료.' : '상품 등록 완료.');

    // setIsSubmitting(true);

    // try {
    //   const newImages = images.filter((img) => !img.isExisting);
    //   let imagePaths = [];

    //   if (newImages.length > 0) {
    //     const uploadPromises = newImages.map(async (img) => {
    //       const presignedData = await getPresignedUrl.mutateAsync(img.file);

    //       // Mock mode
    //       if (!presignedData.preSignedUrl.includes('fake-s3-url')) {
    //         await uploadToS3(img.file, presignedData.preSignedUrl);
    //       }

    //       return presignedData.filePath;
    //     });

    //     imagePaths = await Promise.all(uploadPromises);
    //   }

    //   // 수정 모드 - 기존 이미지 경로 포함
    //   const existingImagePaths = images
    //     .filter((img) => img.isExisting)
    //     .map((img) => img.preview);

    //   const formData = {
    //     name: productName,
    //     category_id: parseInt(subCategory),
    //     product_size: productSize,
    //     sizes: {
    //       total_length: totalLength ? parseInt(totalLength) : null,
    //       sleeve: sleeve ? parseInt(sleeve) : null,
    //       shoulder: shoulder ? parseInt(shoulder) : null,
    //       chest: chest ? parseInt(chest) : null,
    //     },
    //     description: description.trim(),
    //     item_price: parseInt(price),
    //     direct_trade: directTrade === 'yes',
    //     image_paths: [...existingImagePaths, ...imagePaths],
    //   };

    //   if (isEditMode) {
    //     await updateProduct.mutateAsync({ itemId, productData: formData });
    //     alert('상품이 수정되었습니다.');
    //     navigate(`/product/${itemId}`);
    //   } else {
    //     const result = await createProduct.mutateAsync(formData);
    //     alert('상품이 등록되었습니다.');
    //     navigate(`/product/${result.data?.item_id}`);
    //   }
    // } catch (error) {
    //   alert('상품 등록/수정 중 오류가 발생했습니다.');
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  // 핸들러 - 상품 삭제
  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(itemId);
      alert('상품이 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      alert('상품 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteClick = () => {
    openModal(Modal, {
      title: '상품 삭제',
      children: (
        <div>
          <p>정말로 이 상품을 삭제하시겠습니까?</p>
          <p>삭제된 상품은 복구할 수 없습니다.</p>
        </div>
      ),
      buttons: [
        {
          label: '삭제',
          variant: 'standard-primary',
          onClick: handleDelete,
        },
      ],
    });
  };

  return (
    <div className="product-upload-page">
      <h1 className="product-upload-page__title">
        {!isEditMode ? '판매글 작성' : '게시글 수정'}
      </h1>

      <div className="product-form">
        <form
          className="product-form__form"
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
        >
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
              placeholder="메인 카테고리 선택"
              value={mainCategory}
              onChange={handleMainCategoryChange}
              options={mainCategories}
              required={true}
              disabled={categoriesLoading}
            />
            {subCategories.length > 0 && (
              <SelectBox
                name="subCategory"
                placeholder="서브 카테고리 선택"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                options={subCategories}
                disabled={!mainCategory}
                required={true}
              />
            )}
          </div>

          {/* 사이즈 */}
          <SelectBox
            label="사이즈"
            name="productSize"
            placeholder="사이즈 선택"
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

          {/* 등록/수정 버튼 */}
          <div className="product-form__actions">
            <div className="product-form__submit-buttons">
              <Button
                type="submit"
                label={isEditMode ? '수정하기' : '등록하기'}
                variant="standard-primary"
                onClick={() => formRef.current?.requestSubmit?.()}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                label="취소"
                variant="standard-secondary"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              />
            </div>
            <div className="product-form__delete-button">
              {isEditMode && (
                <Button
                  type="button"
                  label="상품 삭제하기"
                  variant="danger-primary"
                  onClick={handleDeleteClick}
                  disabled={isSubmitting}
                />
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
