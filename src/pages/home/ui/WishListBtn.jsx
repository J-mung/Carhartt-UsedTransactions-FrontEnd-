import { useQueryClient } from '@tanstack/react-query';
import {
  useWishlistStatus,
  useAddWishlist,
  useRemoveWishlist,
} from '@/entities/user/hooks/useWishList';

// 상품 카드 컴포넌트에 표시되는 찜하기 버튼
export default function WishListBtn({ product }) {
  const queryClient = useQueryClient();

  // Wishlist status 조회
  const { data: wishlistStatus } = useWishlistStatus(product.item_id);
  const isWishlisted = wishlistStatus?.wished || false;

  const addWishlist = useAddWishlist();
  const removeWishlist = useRemoveWishlist();

  // Loading state
  const isLoading = addWishlist.isPending || removeWishlist.isPending;

  // 찜하기 버튼 클릭 핸들러
  const handleWishlistClick = (e) => {
    e.preventDefault(); // Prevent card click
    e.stopPropagation(); // Prevent event bubbling

    if (isLoading) return; // Prevent double-click

    if (isWishlisted) {
      removeWishlist.mutate(product.item_id, {
        onError: (error) => {
          console.error('찜 해제 실패:', error);
        },
      });
    } else {
      addWishlist.mutate(product.item_id, {
        onError: (error) => {
          console.error('찜 추가 실패:', error);
        },
      });
    }
  };

  return (
    <button
      onClick={handleWishlistClick}
      className={`wishlist-btn ${isWishlisted ? 'wishlist-btn--active' : ''} ${isLoading ? 'wishlist-btn--loading' : ''}`}
      aria-label={isWishlisted ? '찜 해제' : '찜하기'}
      disabled={isLoading}
      type="button"
    >
      <span className="ic-wish-list"></span>
    </button>
  );
}
