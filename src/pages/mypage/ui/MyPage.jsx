import ImageUploader from '@/pages/mypage/ui/ImageUploader';
import { Button } from '@/shared/ui/buttons';
import TabGroup from '@/shared/ui/tabs/TabGroup';
import ThemeToggle from '@/shared/ui/ThemeToggle';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './myPage.scss';

const PAGE_SIZE = 4;

function MyPageProductCard({ item }) {
  return (
    <article className="my-page-card">
      <div className="my-page-card__thumbnail" aria-hidden="true">
        <div className="my-page-card__thumbnail-icon">IMG</div>
      </div>
      <div className="my-page-card__body">
        <header className="my-page-card__header">
          <h3 className="my-page-card__title h5">{item.title}</h3>
          <span
            className={`my-page-card__status my-page-card__status--${item.statusType}`}
          >
            {item.status}
          </span>
        </header>
        <div className="my-page-card__price h5-regular">{item.price}</div>
        <p className="my-page-card__description text-regular">
          {item.description}
        </p>
        <div className="my-page-card__actions">
          <Button label="자세히 보기" size="--s" variant="standard-secondary" />
        </div>
      </div>
    </article>
  );
}

function MyPageProductList({ items, emptyText }) {
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
      <div className="my-page__empty">
        <span className="text-regular">{emptyText}</span>
      </div>
    );
  }

  return (
    <>
      <div className="my-page__items">
        {visibleItems.map((item) => (
          <MyPageProductCard key={item.id} item={item} />
        ))}
      </div>
      {isFetching && hasMore && (
        <div className="my-page__loader text-caption" role="status">
          상품을 불러오는 중입니다...
        </div>
      )}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="my-page__sentinel"
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default function MyPage() {
  const { openModal } = useModal();

  const profile = useMemo(
    () => ({
      nickname: '사용자 닉네임',
      email: 'user@example.com',
      joinDate: '2024.01.12 가입',
      point: '3,200P',
      stats: [
        { key: 'selling', label: '판매중', value: 3 },
        { key: 'sold', label: '판매완료', value: 12 },
        { key: 'purchased', label: '구매완료', value: 5 },
      ],
    }),
    []
  );

  const sellingList = useMemo(
    () => [
      {
        id: 'sale-1',
        title: '카브카 초어코트',
        price: '129,000원',
        status: '판매 중',
        statusType: 'ongoing',
        description: '1회 착용 · 택포',
      },
      {
        id: 'sale-2',
        title: 'OG Chore Jacket',
        price: '98,000원',
        status: '판매 완료',
        statusType: 'completed',
        description: '빈티지 워싱 · 실측 103',
      },
      {
        id: 'sale-3',
        title: 'Active Jacket',
        price: '155,000원',
        status: '택배 예약 중',
        statusType: 'ongoing',
        description: '미시즌 · L 사이즈',
      },
      {
        id: 'sale-4',
        title: 'Detroit Jacket',
        price: '178,000원',
        status: '구매자 확인 중',
        statusType: 'ongoing',
        description: '교신 환영 · 상태 A',
      },
      {
        id: 'sale-5',
        title: 'Trapper Hat',
        price: '52,000원',
        status: '판매 완료',
        statusType: 'completed',
        description: '착용감 거의 없음',
      },
      {
        id: 'sale-6',
        title: 'Canvas Tote Bag',
        price: '39,000원',
        status: '판매 중',
        statusType: 'ongoing',
        description: '한정 컬러 · 생활 오염 약간',
      },
    ],
    []
  );

  const purchaseList = useMemo(
    () => [
      {
        id: 'buy-1',
        title: '아크틱 코트',
        price: '225,000원',
        status: '배송 중',
        statusType: 'ongoing',
        description: '로지스팟 집하 완료',
      },
      {
        id: 'buy-2',
        title: '미시간 코트',
        price: '189,000원',
        status: '구매 완료',
        statusType: 'completed',
        description: '거래 종료 · 리뷰 작성 완료',
      },
      {
        id: 'buy-3',
        title: 'OG Santa Fe Jacket',
        price: '210,000원',
        status: '배송 준비중',
        statusType: 'ongoing',
        description: '판매자 발송 대기',
      },
      {
        id: 'buy-4',
        title: 'Ruck Single Knee Pant',
        price: '119,000원',
        status: '구매 완료',
        statusType: 'completed',
        description: '실착감 만족 · 후기 작성 예정',
      },
    ],
    []
  );

  const wishList = useMemo(
    () => [
      {
        id: 'wish-1',
        title: '트레드 밀 비니',
        price: '32,000원',
        status: '가격 인하',
        statusType: 'notice',
        description: '찜한 후 2일 경과 · 5,000원 인하',
      },
      {
        id: 'wish-2',
        title: 'Kendrick Cap',
        price: '46,000원',
        status: '판매중',
        statusType: 'ongoing',
        description: '남은 수량 1개',
      },
      {
        id: 'wish-3',
        title: 'Hooded Sail Jacket',
        price: '165,000원',
        status: '재입고 알림',
        statusType: 'notice',
        description: '입고 예정 · 3일 전 안내',
      },
      {
        id: 'wish-4',
        title: 'Simple Pant',
        price: '85,000원',
        status: '판매중',
        statusType: 'ongoing',
        description: '사이즈 30 · 새상품 급',
      },
      {
        id: 'wish-5',
        title: 'Jake Hip Bag',
        price: '58,000원',
        status: '가격 인하',
        statusType: 'notice',
        description: '10% 할인 진행 중',
      },
    ],
    []
  );

  const openProfileModal = () => {
    openModal(Modal, {
      title: '프로필 이미지 변경',
      children: <ImageUploader />,
    });
  };

  const openNicknameModal = () => {
    openModal(Modal, {
      title: '닉네임 변경',
      children: (
        <div className="my-page__nickname-modal">
          <p className="text-regular">닉네임 변경 기능이 준비 중입니다.</p>
        </div>
      ),
    });
  };

  const PanelLayout = ({ children }) => (
    <div className="my-page__panel">{children}</div>
  );

  const tabGroup = [
    {
      key: 'selling',
      label: '판매',
      content: (
        <MyPageProductList
          items={sellingList}
          emptyText="판매중인 상품이 없습니다."
        />
      ),
    },
    {
      key: 'purchase',
      label: '구매',
      content: (
        <MyPageProductList
          items={purchaseList}
          emptyText="구매 내역이 없습니다."
        />
      ),
    },
    {
      key: 'wishlist',
      label: '찜',
      content: (
        <MyPageProductList items={wishList} emptyText="찜한 상품이 없습니다." />
      ),
    },
  ];

  return (
    <div className="my-page">
      <div className="my-page__header">
        <div>
          <h2 className="my-page__title h3">마이페이지</h2>
          <p className="my-page__subtitle text-regular">
            회원 정보와 거래 현황을 한 눈에 확인해보세요.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <section className="my-page__profile-card">
        <div className="my-page__avatar">
          <div className="my-page__avatar-image" aria-hidden="true">
            <span>USER</span>
          </div>
          <Button
            label="프로필 수정"
            size="--s"
            variant="standard-secondary"
            onClick={openProfileModal}
          />
        </div>

        <div className="my-page__profile-details">
          <div className="my-page__nickname-row">
            <span className="my-page__nickname h4">{profile.nickname}</span>
            <Button
              label="닉네임 수정"
              size="--s"
              variant="standard-secondary"
              onClick={openNicknameModal}
            />
          </div>

          <dl className="my-page__meta">
            <div>
              <dt className="text-caption">이메일</dt>
              <dd className="text-regular">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-caption">가입일</dt>
              <dd className="text-regular">{profile.joinDate}</dd>
            </div>
            <div>
              <dt className="text-caption">보유 포인트</dt>
              <dd className="text-regular">{profile.point}</dd>
            </div>
          </dl>

          <div className="my-page__stats">
            {profile.stats.map((stat) => (
              <div key={stat.key} className="my-page__stat">
                <span className="my-page__stat-label text-caption">
                  {stat.label}
                </span>
                <span className="my-page__stat-value h4">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="my-page__tabs">
        <TabGroup tabGroup={tabGroup} Layout={PanelLayout} />
      </div>
    </div>
  );
}
