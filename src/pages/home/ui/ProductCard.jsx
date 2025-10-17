import { useNavigate } from 'react-router-dom';
import WishlistBtn from './WishlistBtn';
import './productCard.scss';

/**
 * 상품 카드 컴포넌트
 * 상품 이미지, 상품명, 가격, 찜하기 버튼 포함
 *
 * @param {Object} product - Product data from API
 * @param {number} product.item_id - Product ID (from API)
 * @param {string} product.name - Product name (from sell form)
 * @param {number} product.item_price - Product price (from sell form)
 * @param {Array} product.images - Product images array (from sell form S3 URLs)
 */
export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // 첫 상품 이미지
  const representativeImage = product.images?.find(
    (img) => img.is_represent === 1
  );
  const displayImage =
    representativeImage?.image_url || product.images?.[0]?.image_url;

  const handleClick = () => {
    // navigate(`/product/${product.item_id}`);
    alert('상품 페이지로 이동');
  };

  return (
    <article className="product-card" onClick={handleClick}>
      {/* 상품 이미지 */}
      <div className="product-card__image">
        <img
          src={displayImage}
          alt={product.name}
          className="product-card__image-img"
          loading="lazy"
        />
        <div className="product-card__image-overlay">
          <span className="product-card__image-overlay-text">자세히 보기</span>
        </div>

        {/* 찜하기 버튼 */}
        <WishlistBtn product={product} />
      </div>

      {/* 상품 정보 */}
      <div className="product-card__info">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__price">
          {product.item_price.toLocaleString()}원
        </p>
      </div>
    </article>
  );
}
