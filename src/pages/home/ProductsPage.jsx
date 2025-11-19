import heroVideo from '@/app/assets/videos/hero_video.mp4';
import {
  useCategories,
  useProductsList,
} from '@/entities/product/hooks/useProduct';
import RadioGroup from '@/shared/ui/Radio';
import SelectBox from '@/shared/ui/SelectBox';
import { useMemo, useState } from 'react';
import './productsPage.scss';
import ProductCard from './ui/ProductCard';

// 페이지당 아이템 수
const ITEMS_PER_PAGE = 16;

// Sorting options
const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: '최신순' },
  { value: 'price,asc', label: '낮은 가격순' },
  { value: 'price,desc', label: '높은 가격순' },
];

// Radio 버튼용 카테고리 평탄화 함수
function flattenCategories(apiCategories) {
  const rootCategory = apiCategories[0];

  // Top-level 카테고리만 반환
  return rootCategory.children.map((cat) => ({
    category_id: cat.category_id,
    category_name: cat.category_name,
    p_id: cat.p_id,
  }));
}

export default function ProductsListPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories from API
  const {
    data: apiCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Fetch products from API
  const {
    data: apiProductsData,
    isLoading: productsLoading,
    error: productsError,
    isFetching,
  } = useProductsList({
    categoryId: selectedCategory,
    sort: sortBy,
    page: currentPage,
    size: ITEMS_PER_PAGE,
  });

  // 상품 데이터
  const products = apiProductsData?.items || [];
  const totalProducts = apiProductsData?.total || 0;
  const totalPages = apiProductsData?.totalPages || 1;

  const categories = useMemo(() => {
    if (categoriesLoading || categoriesError || !apiCategories?.length) {
      return [];
    }
    return flattenCategories(apiCategories);
  }, [apiCategories, categoriesLoading, categoriesError]);

  // Transform categories for RadioGroup
  const categoryOptions = useMemo(() => {
    const allOption = {
      key: 'all',
      value: 'all',
      label: '전체보기',
    };

    const categoryOpts = categories.map((cat) => ({
      key: String(cat.category_id),
      value: String(cat.category_id),
      label: cat.category_name,
    }));

    return [allOption, ...categoryOpts];
  }, [categories]);

  // Pagination
  const paginationOptions = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => ({
      key: String(i + 1),
      value: String(i + 1),
    }));
  }, [totalPages]);

  // 이벤트 핸들러
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (e) => {
    setCurrentPage(parseInt(e.target.value));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="hero">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>
      </section>

      <div className="products-list">
        {/* 카테고리 필터 */}
        <div className="products-list__categories">
          <RadioGroup
            name="category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="button"
          />
        </div>

        {/* 상품 수 & sorting dropdown */}
        <div className="products-list__results">
          <div className="total_number">총 {totalProducts}개의 상품</div>
          <div className="sorting_dropdown">
            <SelectBox
              value={sortBy}
              onChange={handleSortChange}
              options={SORT_OPTIONS}
              size="--s"
            />
          </div>
        </div>

        {/* 상품 그리드 */}
        <div className="products-list__grid">
          {products.length === 0 ? (
            <div className="empty-products">
              <p>등록된 상품이 없습니다.</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.item_id} product={product} />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="products-list__pagination">
            <RadioGroup
              name="pagination"
              options={paginationOptions}
              value={String(currentPage)}
              onChange={handlePageChange}
              variant="button"
              showNavigation={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
