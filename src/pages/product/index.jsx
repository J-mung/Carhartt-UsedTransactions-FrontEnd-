import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { productData } from './model/mockProductData'; // temporary mock data
// import { useProductDetail } from './model/useProductDetail';
import { useModal } from '@/widgets/modal/ModalProvider';
import Modal from '@/widgets/modal/Modal';
import ImageCarousel from './ui/ImageCarousel';
import ProductInfo from './ui/ProductInfo';
import './ui/productDetail.scss';

export default function ProductPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModal();

  // Temporary mock data
  const product = productData;
  const isLoading = false;
  const isError = false;
  const error = null;

  // Temporary user data -> Get current user from auth context
  const currentUserId = 'user123';
  const isSeller = product?.seller_id === currentUserId;

  // Error modal
  useEffect(() => {
    if (isError) {
      openModal(Modal, {
        title: '오류 발생',
        children: (
          <div>
            <p>{error?.message || '상품을 불러올 수 없습니다.'}</p>
            <p>잠시 후 다시 시도해주세요.</p>
          </div>
        ),
        buttons: [
          {
            label: '홈으로 돌아가기',
            variant: 'standard-primary',
            onClick: () => navigate('/'),
          },
        ],
      });
    }
  }, [isError, error, openModal, navigate]);

  // Handlers
  const handleWishlist = () => {
    alert('찜 목록에 추가되었습니다');
  };

  const handleBuy = () => {
    // navigate(``);
    alert('구매 페이지로 이동');
  };

  const handleChat = () => {
    // navigate(``);
    alert('채팅 페이지로 이동');
  };

  const handleEdit = () => {
    // navigate(``);
    alert('게시글 수정 페이지로 이동');
  };

  if (isLoading) {
    return (
      <div className="product-detail__loading">
        <div>로딩 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="product-detail__error">
        <h2 className="product-detail__error-title">
          상품을 불러올 수 없습니다
        </h2>
        <p className="product-detail__error-message">
          잠시 후 다시 시도해주세요
        </p>
        <button
          className="product-detail__error-button"
          onClick={() => navigate('/')}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <div className="product-detail__breadcrumb">
        카테고리 &gt; 액티브 OG &gt; J130
      </div>

      <div className="product-detail__wrapper">
        <ImageCarousel
          images={product?.images?.map((img) => img.image_url) || []}
        />
        <ProductInfo
          product={product}
          onWishlist={handleWishlist}
          onBuy={handleBuy}
          onChat={handleChat}
          onEdit={handleEdit}
          isSeller={isSeller}
        />
      </div>
    </div>
  );
}
