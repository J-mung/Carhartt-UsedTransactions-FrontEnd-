import { useState } from 'react';
import { resizeImage } from './imageResizer';

export function useImageUploader() {
  const [items, setItems] = useState([]);

  // 파일 선택
  const handleSelect = (event) => {
    const selected = Array.from(event.target.files).map((_file) => ({
      file: _file,
      preview: URL.createObjectURL(_file),
    }));
    setItems((prev) => [...prev, ...selected]);
  };

  // 업로드 (압축/리사이즈 후)
  const handleConfirm = async () => {
    const compressed = [];
    for (const { file } of items) {
      console.log('압축 전: ', file);
      const format = supportsWebP() ? 'image/webp' : 'image/jpeg';
      const resized = await resizeImage(file, {
        width: 800,
        height: 800,
        format: format,
      });
      compressed.push(resized);
    }

    // S3 업로드 로직 추가될 부분
    console.log('압축 완료: ', compressed);
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
