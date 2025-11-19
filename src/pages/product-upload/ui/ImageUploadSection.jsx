import { useRef } from 'react';
import { resizeImage } from '@/pages/mypage/model/imageResizer';
import './imageUploadSection.scss';

/**
 * 상품 이미지 업로드 컴포넌트
 * profile/ui/ImageUploader.jsx 참고 + 상품 페이지에 맞게 수정
 * - 최대 12장까지 업로드 가능
 * - Grid layout + 미리보기
 * - 각 이미지 삭제 가능
 * - Image counter
 */
export default function ImageUploadSection({
  images,
  onImagesChange,
  maxImages = 12,
}) {
  const fileInputRef = useRef(null);

  // Check WebP support
  const supportsWebP = () => {
    try {
      return document
        .createElement('canvas')
        .toDataURL('image/webp')
        .startsWith('data:image/webp');
    } catch {
      return false;
    }
  };

  // Handle file selection
  const handleSelect = async (event) => {
    const files = Array.from(event.target.files);

    // Check max limit
    if (images.length + files.length > maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    // Process images using the same logic as profile
    const format = supportsWebP() ? 'image/webp' : 'image/jpeg';

    const selectedPromises = files.map((file) => {
      return resizeImage(file, {
        width: 800,
        height: 'auto',
        format: format,
      })
        .then((resized) => {
          return {
            file: resized,
            overSize: false,
            preview: URL.createObjectURL(resized),
          };
        })
        .catch(() => {
          return {
            file: file,
            overSize: true,
            preview: URL.createObjectURL(file),
          };
        });
    });

    try {
      const selected = await Promise.all(selectedPromises);
      onImagesChange([...images, ...selected]);
    } catch (error) {
      console.error('Image processing error:', error);
      alert('이미지 처리 중 오류가 발생했습니다.');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    URL.revokeObjectURL(images[index].preview);
    onImagesChange(newImages);
  };

  // Trigger file input
  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="image-upload-section">
      <h3 className="image-upload-section__title">
        상품 이미지{' '}
        <span className="image-upload-section__counter">
          {images.length} / {maxImages}
        </span>
      </h3>
      <div className="image-upload-section__grid">
        {/* 업로드된 이미지 */}
        {images.map((image, idx) => (
          <div key={idx} className="image-upload-section__item">
            <div className="image-upload-section__preview">
              <img
                className="image-upload-section__image"
                src={image.preview}
                alt={image.file?.name || `Image ${idx + 1}`}
                onError={() =>
                  console.log('Failed to load image:', image.preview)
                }
              />

              {/* Remove button */}
              <button
                type="button"
                className="image-upload-section__remove"
                onClick={() => handleRemoveImage(idx)}
                aria-label="이미지 삭제"
              >
                <span className="ic-close"></span>
              </button>

              {/* 용량 초과 시 에러 */}
              {image.overSize && (
                <div className="image-upload-section__warning">용량 초과</div>
              )}
            </div>
          </div>
        ))}

        {/* 추가 버튼 */}
        {images.length < maxImages && (
          <div className="image-upload-section__item">
            {images.length === 0 ? (
              <button
                type="button"
                className="image-upload-section__upload-btn"
                onClick={handleAddClick}
              >
                <span className="ic-upload"></span>
              </button>
            ) : (
              <button
                type="button"
                className="image-upload-section__add-btn"
                onClick={handleAddClick}
              >
                <span className="ic-add"></span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        className="image-upload-section__input"
        aria-label="이미지 파일 선택"
      />
    </div>
  );
}
