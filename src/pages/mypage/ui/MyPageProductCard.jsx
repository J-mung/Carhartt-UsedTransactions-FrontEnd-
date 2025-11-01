import { Button } from '@/shared/ui/buttons';

export default function MyPageProductCard({ item }) {
  return (
    <article className={'my-page-card'}>
      <div className={'my-page-card__thumbnail'} aria-hidden={'true'}>
        <div className={'my-page-card__thumbnail-icon'}>IMG</div>
      </div>
      <div className={'my-page-card__body'}>
        <header className={'my-page-card__header'}>
          <h3 className={'my-page-card__title h5'}>{item.title}</h3>
          <span
            className={`my-page-card__status my-page-card__status--${item.statusType}`}
          >
            {item.status}
          </span>
        </header>
        <div className={'my-page-card__price h5-regular'}>{item.price}</div>
        <p className={'my-page-card__description text-regular'}>
          {item.description}
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
