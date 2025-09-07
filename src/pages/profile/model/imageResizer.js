import pica from 'pica';

export async function resizeImage(
  file,
  { width = 800, height = 800, format = 'image/webp', quality = 0.9 } = {}
) {
  const img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  await pica().resize(img, canvas);

  const blob = await pica().toBlob(canvas, format, quality);

  URL.revokeObjectURL(img.src);

  return new File(
    [blob],
    file.name.split('.')[0] + '.' + format.split('/'[1], { type: format })
  );
}
