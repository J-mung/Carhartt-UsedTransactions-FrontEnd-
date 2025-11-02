import './imageUploadModal.scss';

export default function ImageUploadModal({ origin, items = [], handleSelect }) {
  const latestSelected =
    items && items.length > 0 ? items[items.length - 1] : null;
  const previewSrc = latestSelected?.preview ?? origin;

  return (
    <div className={'avatar-upload avatar-upload--wrapper'}>
      <div className={'avatar-upload--preview mb-4'} aria-hidden={'true'}>
        <img
          className={'avatar-upload--source'}
          src={previewSrc}
          alt={'Selected profile image preview'}
        />
      </div>
      <input
        className={'avatar-upload--uploader'}
        type={'file'}
        accept={'image/*'}
        multiple={false}
        onChange={handleSelect}
      />
    </div>
  );
}
