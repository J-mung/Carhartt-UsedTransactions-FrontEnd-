import { IMAGE_FORMAT } from '@/entities/user/hooks/constants';
import { useCallback, useState } from 'react';
import { resizeImage } from './imageResizer';

export function useImageUploader() {
  // 파일 리스트
  const [items, setItems] = useState([]);
  // 파일 다중 선택 여부
  const [multiple, setMultiple] = useState(false);

  // 파일 선택
  const handleSelect = useCallback((event) => {
    // 브라우저 지원 포맷에 맞춰 리사이즈 결과물의 포맷 결정
    const format = supportsWebP() ? IMAGE_FORMAT.WEBP : IMAGE_FORMAT.JPEG;

    // 선택된 이미지 파일 압축
    const selectedPromises = Array.from(event.target.files).map((_file) => {
      return resizeImage(_file, {
        width: 800,
        height: 'auto',
        format: format,
      })
        .then((resized) => {
          // 제한 용량 준수
          return {
            file: resized,
            overSize: false,
            preview: URL.createObjectURL(resized),
          };
        })
        .catch(() => {
          // 제한 용량 초과 (추후 로직에서 서버 업로드를 거부)
          return {
            file: _file,
            overSize: true,
            preview: URL.createObjectURL(_file),
          };
        });
    });

    Promise.all(selectedPromises).then((_selected) => {
      _selected.forEach((_select) => {
        console.log(`${Math.round(_select.file.size / 1024)}KB`);
      });
      if (multiple) {
        // 파일을 누적하여 모달에서 최신 선택 이미지를 추적
        setItems((prev) => [...prev, ..._selected]);
      } else {
        setItems([..._selected]);
      }
    });
  }, []);

  // 업로드 완료 혹은 모달 닫기 시 선택 목록 초기화
  const reset = useCallback(() => {
    setItems([]);
  }, []);

  return { items, setMultiple, handleSelect, reset };
}

// WebP 지원 여부
function supportsWebP() {
  try {
    return document
      .createElement('canvas')
      .toDataURL(IMAGE_FORMAT.WEBP)
      .startsWith(`data:${IMAGE_FORMAT.WEBP}`);
  } catch {
    return false;
  }
}
