import {
  useCategories,
  useProductDetail,
} from '@/entities/product/hooks/useProduct';
import { useIsLoggedIn } from '@/entities/user/hooks/useIsLoggedIn';
import { useUserStatus } from '@/entities/user/hooks/useUserStatus';
import {
  useToggleWishlist,
  useWishlistStatus,
} from '@/entities/user/hooks/useWishList';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from './ui/Breadcrumb';
import ImageCarousel from './ui/ImageCarousel';
import ProductInfo from './ui/ProductInfo';
import './ui/productDetail.scss';

export default function ProductPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModal();
  // 사용자 로그인 상태
  const { isLoggedIn, isLoading: loggedInIsLoading } = useIsLoggedIn();
  // 사용자 정보
  const {
    data: userInfo,
    isLoading: userInfoIsLoading,
    isError: userInfoIsError,
  } = useUserStatus();

  // 상품 데이터
  const { data: product, isLoading, isError, error } = useProductDetail(itemId);

  // 카테고리 (for breadcrumb)
  const { data: categories } = useCategories();

  // 찜 목록 status
  const { data: wishlistStatus, isLoading: isWishlistLoading } =
    useWishlistStatus(itemId);
  const { toggleWishlist, isLoading: isToggling } = useToggleWishlist();

  // 임시 유저 데이터 -> Get current user from auth context
  // const currentUserId = 'user123';
  // const isSeller = product?.seller_id === currentUserId;
  // seller 확인 상태
  const [isSeller, setIsSeller] = useState(false);
  // seller 확인
  useEffect(() => {
    // 로그인 상태 및 상품 데이터 loading
    if (loggedInIsLoading || isLoading) {
      return;
    }
    // 유저 정보 조회 에러 혹은 상품 데이터 조회 에러
    if (userInfoIsError || isError) {
      setIsSeller(false);
    }
    // 로그인 상태이고, 유저 정보 조회 가능
    if (isLoggedIn && userInfo?.memberId) {
      setIsSeller(product?.seller_id === userInfo.memberId);
    }
  }, [
    isLoggedIn,
    userInfo,
    isLoggedIn,
    userInfoIsLoading,
    isLoading,
    userInfoIsError,
    isError,
  ]);

  // Handlers
  const handleWishlist = async () => {
    if (!isLoggedIn) {
      openModal(Modal, {
        title: '로그인 필요',
        children: <span className={'text-regular'}>로그인이 필요합니다.</span>,
        onClose: () => navigate('/login', { replace: true }),
      });
    } else {
      // alert('찜 목록에 추가되었습니다');
      try {
        const wasWishlisted = wishlistStatus?.wished;
        await toggleWishlist(itemId, wasWishlisted);

        if (wasWishlisted) {
          openModal(Modal, {
            title: '찜 목록에서 제거되었습니다',
            children: (
              <div>
                <p>찜 목록에서 제거되었습니다.</p>
              </div>
            ),
            buttons: [
              {
                label: '계속 쇼핑하기',
                variant: 'standard-secondary',
                onClick: () => navigate('/'),
              },
            ],
          });
        } else {
          openModal(Modal, {
            title: '찜 목록에 추가되었습니다',
            children: (
              <div>
                <p>찜 목록에 추가되었습니다.</p>
              </div>
            ),
            buttons: [
              {
                label: '찜 목록 보기',
                variant: 'standard-primary',
                onClick: () => alert('찜 목록 페이지로 이동'),
                // onClick: () => navigate('/mypage/wishlist'),
              },
              {
                label: '계속 쇼핑하기',
                variant: 'standard-secondary',
                onClick: () => {},
              },
            ],
          });
        }
      } catch (error) {
        openModal(Modal, {
          title: '오류',
          children: (
            <div>
              <p>찜하기 처리 중 오류가 발생했습니다.</p>
              <p>{error?.message || '잠시 후 다시 시도해주세요.'}</p>
            </div>
          ),
          buttons: [
            {
              label: '확인',
              variant: 'standard-primary',
              onClick: () => {},
            },
          ],
        });
      }
    }
  };

  const handleBuy = (itemId) => {
    isLoggedIn
      ? navigate(`/payment/${itemId}`)
      : openModal(Modal, {
          title: '로그인 필요',
          children: (
            <span className={'text-regular'}>로그인이 필요합니다.</span>
          ),
          onClose: () => navigate('/login', { replace: true }),
        });
    // alert('구매 페이지로 이동');
  };

  const handleChat = () => {
    // navigate(``);
    alert('채팅 페이지로 이동');
  };

  const handleEdit = () => {
    // navigate(`/product/${itemId}/edit`);
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
      <div className="product-detail">
        <div className="product-detail__error">
          <h2>상품을 불러올 수 없습니다</h2>
          <p>{error?.message || '잠시 후 다시 시도해주세요.'}</p>
          {(error?.code === '001' || error?.code === 'C001') && (
            <p>로그인이 필요한 상품입니다.</p>
          )}
          {(error?.code === '004' || error?.code === 'I004') && (
            <p>존재하지 않는 상품입니다.</p>
          )}
          <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <Breadcrumb
        categories={categories}
        currentCategoryId={product?.category_ids || product?.category_id}
      />

      <div className="product-detail__wrapper">
        <ImageCarousel
          images={product?.images?.map((img) => img.image_url) || []}
        />
        <ProductInfo
          product={product}
          onWishlist={handleWishlist}
          onBuy={() => handleBuy(product.item_id)}
          onChat={handleChat}
          onEdit={handleEdit}
          isSeller={isSeller}
          isWishlisted={wishlistStatus?.wished || false}
          isWishlistLoading={isWishlistLoading || isToggling}
        />
      </div>
    </div>
  );
}
