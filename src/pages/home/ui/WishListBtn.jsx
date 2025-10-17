import { useState } from 'react';
// import { carHarttApi } from '@/shared/api/axios';

/**
 * 상품 카드 컴포넌트에 표시되는 찜하기 버튼
 *
 * @param {Object} product - Product data
 * @param {number} product.item_id - Product ID
 */
export default function WishlistBtn({ product }) {
  // Get from global context or React Query
  // For now, use local state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // 찜 목록에 상품 포함 여부
  // const isWishlisted = wishlist.find((item) => {
  //   return item.item_id === product.item_id;
  // });

  // 클릭 > 찜 목록에 추가
  function handleWishlistClick(e) {
    e.stopPropagation();

    // API call로 변경
    if (isWishlisted) {
      // 찜 목록에서 제거
      // await carHarttApi({
      //   method: 'DELETE',
      //   url: `/v1/wishlist/${product.item_id}`,
      //   withCredentials: true,
      // });
      setIsWishlisted(false);
    } else {
      // 찜 목록에 추가
      // await carHarttApi({
      //   method: 'POST',
      //   url: `/v1/wishlist/${product.item_id}`,
      //   withCredentials: true,
      // });
      setIsWishlisted(true);
    }
  }

  return (
    <button
      onClick={handleWishlistClick}
      className={`wishlist-btn ${isWishlisted ? 'wishlist-btn--active' : ''}`}
      aria-label={isWishlisted ? '찜 해제' : '찜하기'}
    >
      <span className="ic-wish-list"></span>
    </button>
  );
}
