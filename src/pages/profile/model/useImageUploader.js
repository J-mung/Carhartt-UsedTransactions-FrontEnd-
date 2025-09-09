import { useState } from 'react';
import { resizeImage } from './imageResizer';

export function useImageUploader() {
  const [items, setItems] = useState([]);

  // 파일 선택
  const handleSelect = (event) => {
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
      setItems((prev) => [...prev, ..._selected]);
    });
  };

  // 업로드 (압축/리사이즈 후)
  const handleConfirm = async () => {
    // 업로드 가능 체크
    const overSizeList = items.filter((_item) => _item.sizeLimit === true);
    if (overSizeList && overSizeList.length > 0) {
      alert('업로드 불가');
      return;
    }

    // 서버에게 S3 Presigned url 요청
    // 발급된 url로 이미지 업로드
    // 200?
    // 서버에게 업로드 완료 안내
    // 종료
  };

  return { items, handleSelect, handleConfirm };
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
