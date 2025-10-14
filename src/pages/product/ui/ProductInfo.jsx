import Button from '@/shared/ui/buttons/Button';
import { useState } from 'react';

export default function ProductInfo({
  product,
  onWishlist,
  onBuy,
  onChat,
  onEdit,
  isSeller,
}) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) return null;

  return (
    <>
      <div className="product-info__basic">
        <div className="product-info__heading">
          {/* 상품명 */}
          <h1 className="title">{product.item_name}</h1>

          {/* 수정 버튼 (게시글 작성자에게만 표시) */}
          {isSeller && (
            <div>
              <Button
                label="게시물 수정"
                variant="standard-secondary"
                size="--s"
                onClick={onEdit}
              />
            </div>
          )}
        </div>
        {/* Price */}
        <div className="product-info__price">
          {product.item_price?.toLocaleString()}원
        </div>

        {/* Size Information - 사이즈 가이드 모달 추가 */}
        {product.sizes && (
          <div className="product-info__size">
            <h3>사이즈 정보</h3>
            {/* Size Table */}
            <table className="product-info__size-chart">
              <tr>
                <th>총장</th>
                <th>소매</th>
                <th>가슴</th>
                <th>어깨</th>
              </tr>
              <tr>
                {product.sizes.total_length && (
                  <td>{product.sizes.total_length}cm</td>
                )}
                {product.sizes.sleeve && <td>{product.sizes.sleeve}cm</td>}
                {product.sizes.chest && <td>{product.sizes.chest}cm</td>}
                {product.sizes.shoulder && <td>{product.sizes.shoulder}cm</td>}
              </tr>
            </table>
            {/* 사이즈 측정 기준 보기 Modal */}
          </div>
        )}

        {/* Action Buttons */}
        <div className="product-info__actions">
          <Button
            label="찜"
            variant="standard-secondary"
            onClick={onWishlist}
          />
          <Button label="구매" variant="standard-secondary" onClick={onBuy} />
          <Button
            label="채팅하기"
            variant="standard-primary"
            onClick={onChat}
          />
        </div>
      </div>

      <div className="product-info__details">
        {/* 상품 정보 */}
        {product.description && (
          <div className="product-desc">
            <h3>상품 정보</h3>
            <p>{product.description}</p>
            {/* 직거래 가능 여부 */}
            <div className="trade-option">
              <p>직거래 가능 여부:</p>
              <p>{product.direct_trade ? '가능' : '불가능'}</p>
            </div>
          </div>
        )}

        {/* 판매자 정보 */}
        {product.seller && (
          <div className="seller-info">
            <h3>판매자 기록</h3>
            <div classname="seller-history">
              <div>
                <span>판매 </span>
                <span>{product.seller.sales_count || 0}</span>
              </div>
              <div>
                <span>구매 </span>
                <span>{product.seller.purchase_count || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
