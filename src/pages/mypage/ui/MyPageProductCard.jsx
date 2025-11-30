import { useMockToggle } from '@/shared/config/MockToggleProvider';
import { Button } from '@/shared/ui/buttons';

export default function MyPageProductCard({ item }) {
  const { useMock } = useMockToggle();

  const normalizeItem = !!item.item_id
    ? {
        title: item.item_name || '이름 없음',
        price: Number(Number.parseInt(item.item_price) || 0).toLocaleString(
          'ko-KR',
          {
            style: 'currency',
            currency: 'KRW',
          }
        ),
        statusType: item.direct_trade ? 'ongoing' : 'completed',
        status: item.direct_trade ? '판매 중' : '판매 완료',
        description: item.description || '설명 없음',
        imageUrl: item.itemImageUrl,
      }
    : {
        title: item.title || '정보 없음',
        statusType: item.statusType || 'notice',
        status: item.status || '정보 없음',
        price: Number(Number.parseInt(item.price) || 0).toLocaleString(
          'ko-KR',
          {
            style: 'currency',
            currency: 'KRW',
          }
        ),
        description: item.description || '정보 없음',
        imageUrl: item.itemImageUrl,
      };
  if (useMock) {
  }
  return (
    <article className={'my-page-card'}>
      <div className={'my-page-card__thumbnail'} aria-hidden={'true'}>
        <div className={'my-page-card__thumbnail-icon'}>
          {normalizeItem.imageUrl ? (
            <img src={`${normalizeItem.imageUrl}`} />
          ) : (
            'IMG'
          )}
        </div>
      </div>
      <div className={'my-page-card__body'}>
        <header className={'my-page-card__header'}>
          <h3 className={'my-page-card__title h5'}>{normalizeItem.title}</h3>
          <span
            className={`my-page-card__status my-page-card__status--${normalizeItem.statusType}`}
          >
            {normalizeItem.status}
          </span>
        </header>
        <div className={'my-page-card__price h5-regular'}>
          {normalizeItem.price}
        </div>
        <p className={'my-page-card__description text-regular'}>
          {normalizeItem.description}
        </p>
        <div className={'my-page-card__actions'}>
          <Button
            label={'자세히 보기'}
            size={'--s'}
            variant={'standard-secondary'}
          />
        </div>
      </div>
    </article>
  );
}
