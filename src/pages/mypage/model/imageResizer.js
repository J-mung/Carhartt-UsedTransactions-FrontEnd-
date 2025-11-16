import { IMAGE_FORMAT } from '@/entities/user/hooks/constants';
import pica from 'pica';

const MAX_KBYTE = 1024 * 300; // 1KB * 300

/**
 * 이미지 압축
 * height는 직접 계산함 (width 기준)
 */
export async function resizeImage(
  file,
  { width = 800, format = IMAGE_FORMAT.WEBP, quality = 0.9 } = {}
) {
  const img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  await img.decode();

  // 비율 계산
  const aspectRatio = img.height / img.width;
  const targetWidth = width;
  const targetHeight = Math.round(targetWidth * aspectRatio);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  await pica().resize(img, canvas);

  // 파일 객체
  const blob = await pica().toBlob(canvas, format, quality);
  // 압축 테스트용 객체
  let blobTest;
  for (let _q = quality; _q > 0.7; _q -= 0.1) {
    blobTest = await pica().toBlob(canvas, format, quality);
    if (blobTest.size < MAX_KBYTE) {
      break;
    }
  }

  // 제한 용량 검사
  if (blobTest.size > MAX_KBYTE) {
    throw new Error(`Over size of the image: ${file.name}`);
  }

  URL.revokeObjectURL(img.src);

  const baseName =
    file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const newName = `${baseName}.${format.split('/')[1]}`;

  return new File([blob], newName, { type: format });
}
