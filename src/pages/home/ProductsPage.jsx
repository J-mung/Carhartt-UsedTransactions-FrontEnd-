import { useState, useMemo } from 'react';
import RadioGroup from '@/shared/ui/Radio';
import SelectBox from '@/shared/ui/SelectBox';
import ProductCard from './ui/ProductCard';
import './productsPage.scss';
import heroVideo from '@/app/assets/videos/hero_video.mp4';

// 예시 데이터 - API로 변경
const MOCK_CATEGORIES = [
  { value: 'all', label: '전체보기' },
  { value: '1', label: '산타페 OG' },
  { value: '2', label: '산타페 WIP OG' },
  { value: '3', label: '액티브 OG' },
  { value: '4', label: '액티브 WIP OG' },
  { value: '5', label: '디트로이트 OG' },
  { value: '6', label: '디트로이트 WIP OG' },
];

// 카테고리용 버튼 옵션
const CATEGORY_BUTTON_OPTIONS = MOCK_CATEGORIES.map((category) => ({
  key: category.value,
  value: category.value,
  label: category.label,
}));

// Sorting option array
const SORT_OPTIONS = [
  { value: 'recent', label: '최신순' },
  { value: 'price_low', label: '낮은 가격순' },
  { value: 'price_high', label: '높은 가격순' },
];

// 50개 예시 상품
// API call로 변경 예정
const MOCK_PRODUCTS = Array.from({ length: 50 }, (_, i) => ({
  item_id: 1000 + i + 1,
  name: `제품명 ${i + 1}`,
  item_price: Math.floor(Math.random() * 500000) + 50000,
  category_id: Math.floor(Math.random() * 6) + 1,
  direct_trade: Math.random() > 0.5,
  images: [
    {
      image_id: 5000 + i * 3 + 1,
      image_url: `https://placeholder.pics/svg/300/CCCCCC/333333/Product ${i + 1}`,
      is_represent: 1,
    },
    ...(Math.random() > 0.5
      ? [
          {
            image_id: 5000 + i * 3 + 2,
            image_url: `https://placeholder.pics/svg/300/DDDDDD/333333/Product ${i + 1} - 2`,
            is_represent: 0,
          },
        ]
      : []),
  ],
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
}));

// 한 페이지당 16개 상품 표시
const ITEMS_PER_PAGE = 16;

export default function ProductsListPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState('1');

  // Filtering & Sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = MOCK_PRODUCTS;

    // 카테고리별 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (p) => p.category_id === parseInt(selectedCategory)
      );
    }

    // Sort - 날짜순, 가격순
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.createdAt - a.createdAt;
        case 'price_low':
          return a.item_price - b.item_price;
        case 'price_high':
          return b.item_price - a.item_price;
        default:
          return 0;
      }
    });

    return sorted;
  }, [selectedCategory, sortBy]);

  // 총 페이지수
  const totalPages =
    Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE) || 1;

  // Get current page products
  const currentProducts = useMemo(() => {
    const startIndex = (parseInt(currentPage) - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedProducts, currentPage]);

  // Pagination 옵션
  const paginationOptions = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => ({
      key: String(i + 1),
      value: String(i + 1),
    }));
  }, [totalPages]);

  // 카테고리 선택 시 페이지 1로 리셋
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage('1');
  };

  // API call로 변경
  // const { data: products, isLoading } = useQuery({
  //   queryKey: ['products', selectedCategory, sortBy],
  //   queryFn: async () => {
  //     const response = await carHarttApi({
  //       method: 'GET',
  //       url: '/v1/items',
  //       params: {
  //         category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
  //         sort: sortBy,
  //       },
  //       withCredentials: true,
  //     });
  //     return response.data;
  //   },
  // });

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="hero">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>
      </section>

      <div className="products-list">
        {/* 카테고리 필터 - 버튼/드롭다운 중 선택 */}
        <div className="products-list__categories">
          {/* v1 - 버튼 */}
          <RadioGroup
            name="category"
            options={CATEGORY_BUTTON_OPTIONS}
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="button"
            size="--l"
          />

          {/* v2 - 드롭다운 */}
          {/* <SelectBox
            value={selectedCategory}
            onChange={handleCategoryChange}
            options={MOCK_CATEGORIES}
            size="--s"
          /> */}
        </div>

        <div className="products-list__results">
          {/* 총 상품 개수 */}
          <div className="total_number">
            총 {filteredAndSortedProducts.length}개의 상품
          </div>
          {/* Sorting Dropdown */}
          <div className="sorting_dropdown">
            <SelectBox
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={SORT_OPTIONS}
              size="--s"
            />
          </div>
        </div>

        {/* 상품 카드 디스플레이 */}
        <div className="products-list__grid">
          {currentProducts.map((product) => (
            <ProductCard key={product.item_id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="products-list__pagination">
            <RadioGroup
              name="pagination"
              options={paginationOptions}
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              variant="button"
              showNavigation={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
