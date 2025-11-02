import { useCallback, useState } from 'react';
import { resizeImage } from './imageResizer';

export function useImageUploader() {
  const [items, setItems] = useState([]);

  // 파일 선택
  const handleSelect = useCallback((event) => {
    // 브라우저 지원 포맷에 맞춰 리사이즈 결과물의 포맷 결정
    const format = supportsWebP() ? 'image/webp' : 'image/jpeg';

    const selectedPromises = Array.from(event.target.files).map((_file) => {
      return resizeImage(_file, {
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
      // 파일을 누적하여 모달에서 최신 선택 이미지를 추적
      setItems((prev) => [...prev, ..._selected]);
    });
  }, []);

  // 업로드 완료 혹은 모달 닫기 시 선택 목록 초기화
  const reset = useCallback(() => {
    setItems([]);
  }, []);

  // 업로드 (압축/리사이즈 후)
  const handleConfirm = useCallback(async () => {
    // 업로드 가능 체크
    const overSizeList = items.filter((_item) => _item.overSize === true);
    if (overSizeList && overSizeList.length > 0) {
      alert('업로드 불가');
      return;
    }

    // 서버에게 S3 Presigned url 요청
    // 발급된 url로 이미지 업로드
    // 200?
    // 서버에게 업로드 완료 안내
    // 종료
  }, [items]);

  return { items, handleSelect, handleConfirm, reset };
}

function supportsWebP() {
  try {
    return document
      .createElement('canvas')
      .toDataURL('image/webp')
      .startsWith('data:image/webp');
  } catch {
    return false;
  }
}
