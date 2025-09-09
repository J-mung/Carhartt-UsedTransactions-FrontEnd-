import pica from 'pica';

const MAX_KBYTE = 1024 * 300; // 1KB * 300

/**
 * 이미지 압축
 * height는 직접 계산함 (width 기준)
 */
export async function resizeImage(
  file,
  { width = 800, format = 'image/webp', quality = 0.9 } = {}
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

  const blob = await pica().toBlob(canvas, format, quality);
  let blobTest;
  for (let _q = quality; _q > 0.7; _q -= 0.1) {
    blobTest = await pica().toBlob(canvas, format, quality);
    if (blobTest.size < MAX_KBYTE) {
      break;
    }
  }

  if (blobTest.size > MAX_KBYTE) {
    throw new Error(`Over size of the image: ${file.name}`);
  }

  URL.revokeObjectURL(img.src);

  return new File(
    [blob],
    file.name.split('.')[0] + '.' + format.split('/'[1], { type: format })
  );
}
