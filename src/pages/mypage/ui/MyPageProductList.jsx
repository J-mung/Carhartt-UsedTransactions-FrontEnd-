import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MyPageProductCard from './MyPageProductCard';

const PAGE_SIZE = 4;

export default function MyPageProductList({ items, emptyText }) {
  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(PAGE_SIZE, items.length)
  );
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setVisibleCount(Math.min(PAGE_SIZE, items.length));
    setIsFetching(false);
    isFetchingRef.current = false;
  }, [items]);

  const loadMore = useCallback(() => {
    setIsFetching(true);
    setVisibleCount((prev) => {
      if (prev >= items.length) {
        return prev;
      }
      const next = Math.min(prev + PAGE_SIZE, items.length);
      return next;
    });
  }, [items.length]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const hasMore = visibleCount < items.length;

  useEffect(() => {
    if (!hasMore) {
      return undefined;
    }

    const target = sentinelRef.current;
    if (!target) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isFetchingRef.current) {
            isFetchingRef.current = true;
            loadMore();
          }
        });
      },
      { rootMargin: '160px 0px', threshold: 0.1 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  useEffect(() => {
    isFetchingRef.current = false;
    setIsFetching(false);
  }, [visibleCount]);

  if (!items.length) {
    return (
      <div className={'my-page__empty'}>
        <span className={'text-regular'}>{emptyText}</span>
      </div>
    );
  }

  return (
    <>
      <div className={'my-page__items'}>
        {visibleItems.map((item) => (
          <MyPageProductCard key={item.id} item={item} />
        ))}
      </div>
      {isFetching && hasMore && (
        <div className={'my-page__loader text-caption'} role={'status'}>
          상품을 불러오는 중입니다...
        </div>
      )}
      {hasMore && (
        <div
          ref={sentinelRef}
          className={'my-page__sentinel'}
          aria-hidden={'true'}
        />
      )}
    </>
  );
}
