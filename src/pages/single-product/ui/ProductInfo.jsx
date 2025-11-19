import Button from '@/shared/ui/buttons/Button';
import { useModal } from '@/widgets/modal/ModalProvider';
import Modal from '@/widgets/modal/Modal';
import SizeGuide from '@/app/assets/images/size_guide.png';

export default function ProductInfo({
  product,
  onWishlist,
  onBuy,
  onChat,
  onEdit,
  isSeller,
  isWishlisted,
  isWishlistLoading,
}) {
  const { openModal } = useModal();

  if (!product) return null;

  // 사이즈 가이드 모달 handler
  const handleOpenSizeGuide = () => {
    openModal(Modal, {
      title: '사이즈 측정 기준',
      children: (
        <div className="size-guide">
          <img src={SizeGuide} alt="사이즈 측정 가이드" />
          <cite>출처: 칼하트윕 온라인 스토어</cite>
        </div>
      ),
      buttons: [],
      className: 'size-guide-modal',
    });
  };

  return (
    <>
      <div className="product-info__basic">
        <div className="product-info__heading">
          {/* 상품명 */}
          <h1 className="title">{product.item_name}</h1>

          {/* 수정 버튼 (게시글 작성자에게만 표시) */}
          {isSeller && (
            <Button
              label="게시물 수정"
              variant="standard-secondary"
              size="--s"
              onClick={onEdit}
            />
          )}
        </div>
        {/* 가격 */}
        <div className="product-info__price">
          {product.item_price?.toLocaleString()}원
        </div>

        {/* 사이즈 정보 */}
        {product.sizes && (
          <div className="product-info__size">
            <h3>사이즈 정보</h3>
            {/* 사이즈 테이블 */}
            <table className="product-info__size-chart">
              <thead>
                <tr>
                  <th>총장</th>
                  <th>소매</th>
                  <th>가슴</th>
                  <th>어깨</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {product.sizes.total_length && (
                    <td>{product.sizes.total_length}cm</td>
                  )}
                  {product.sizes.sleeve && <td>{product.sizes.sleeve}cm</td>}
                  {product.sizes.chest && <td>{product.sizes.chest}cm</td>}
                  {product.sizes.shoulder && (
                    <td>{product.sizes.shoulder}cm</td>
                  )}
                </tr>
              </tbody>
            </table>
            <button className="size-guide-btn" onClick={handleOpenSizeGuide}>
              사이즈 측정 기준 보기
            </button>
          </div>
        )}

        {/* 버튼 - 찜/구매/채팅하기 */}
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
            <p>{product.seller.nickname}</p>
            <div className="seller-history">
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
