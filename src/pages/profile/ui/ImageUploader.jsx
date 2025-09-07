import { useImageUploader } from '../model/useImageUploader';

export default function ImageUploader() {
  const { items, handleSelect, handleConfirm } = useImageUploader();

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleSelect} />
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {items.map(({ file, preview }, idx) => {
          <div key={idx} style={{ textAlign: 'center' }}>
            <img
              src={preview}
              alt={file.name}
              onError={() => console.log('Fale to load image(s): ', preview)}
              style={{
                width: 150,
                height: 150,
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
            <p style={{ fontSize: '0.9rem' }}>{file.name}</p>
          </div>;
        })}
      </div>
      {items.length > 0 && (
        <button onClick={handleConfirm} style={{ marginTop: '1rem' }}>
          확인 (압축 후 업로드)
        </button>
      )}
    </div>
  );
}
