import { useImageUploader } from '../model/useImageUploader';
import './imageUploader.scss';

export default function ImageUploader() {
  const { items, handleSelect, handleConfirm } = useImageUploader();

  return (
    <div className={'image-uploader'}>
      <input type="file" accept="image/*" multiple onChange={handleSelect} />
      <div className={'image-uploader__items'}>
        {items.map(({ file, preview }, idx) => (
          <div key={idx} className={'image-uploader__item'}>
            <img
              className={'image-uploader__preview'}
              src={preview}
              alt={file.name}
              onError={() => console.log('Fale to load image(s): ', preview)}
            />
            <p className={'image-uploader__label'}>{file.name}</p>
          </div>
        ))}
      </div>
      <button className={'image-uploader__button'} onClick={handleConfirm}>
        확인 (압축 후 업로드)
      </button>
    </div>
  );
}
