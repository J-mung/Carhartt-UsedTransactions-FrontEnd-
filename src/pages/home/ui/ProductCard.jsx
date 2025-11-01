import { useNavigate } from 'react-router-dom';
import { useIsLoggedIn } from '@/entities/user/hooks/useIsLoggedIn';
import WishListBtn from './WishListBtn';
import './productCard.scss';

/**
 * 상품 카드 컴포넌트
 * 상품 이미지, 상품명, 가격, 찜하기 버튼 포함
 */
export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useIsLoggedIn();

  // 첫 상품 이미지
  const representativeImage = product.images?.find(
    (img) => img.is_represent === 1
  );
  const displayImage =
    representativeImage?.image_url || product.images?.[0]?.image_url;

  const handleClick = () => {
    navigate(`/product/${product.item_id}`);
  };

  return (
    <article className="product-card" onClick={handleClick}>
      {/* 상품 이미지 */}
      <div className="product-card__image">
        <img
          src={displayImage}
          alt={product.item_name}
          className="product-card__image-img"
          loading="lazy"
        />
        <div className="product-card__image-overlay">
          <span className="product-card__image-overlay-text">자세히 보기</span>
        </div>

        {/* 찜하기 버튼 - 로그인 상태에서만 디스플레이 */}
        {isLoggedIn && <WishListBtn product={product} />}
      </div>

      {/* 상품 정보 */}
      <div className="product-card__info">
        <h3 className="product-card__title">{product.item_name}</h3>
        <p className="product-card__price">
          {product.item_price.toLocaleString()}원
        </p>
      </div>
    </article>
  );
}
