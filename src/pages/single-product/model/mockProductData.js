// Mock 아이템 데이터
export const productData = {
  item_id: 1101,
  item_name: 'Product name',
  category_ids: [1, 11],
  sizes: {
    total_length: 72,
    shoulder: 50,
    sleeve: 64,
    chest: 58,
  },
  item_price: 150000,
  direct_trade: true,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a dui ultrices nisi scelerisque sagittis id hendrerit nulla.',
  images: [
    {
      image_id: 5001,
      image_url:
        'https://placeholder.pics/svg/300/000000/FFFFFF/Placeholder%20Image',
      is_represent: 1,
    },
    {
      image_id: 5002,
      image_url:
        'https://placeholder.pics/svg/300/000000/FFFFFF/Placeholder%20Image',
      is_represent: 0,
    },
    {
      image_id: 5003,
      image_url:
        'https://placeholder.pics/svg/300/000000/FFFFFF/Placeholder%20Image',
      is_represent: 0,
    },
    {
      image_id: 5004,
      image_url:
        'https://placeholder.pics/svg/300/000000/FFFFFF/Placeholder%20Image',
      is_represent: 1,
    },
    {
      image_id: 5005,
      image_url:
        'https://placeholder.pics/svg/300/000000/FFFFFF/Placeholder%20Image',
      is_represent: 0,
    },
    {
      image_id: 5006,
      image_url:
        'https://placeholder.pics/svg/300/000000/FFFFFF/Placeholder%20Image',
      is_represent: 0,
    },
    {
      image_id: 5007,
      image_url:
        'https://placeholder.pics/svg/300/000000/FFFFFF/Placeholder%20Image',
      is_represent: 1,
    },
  ],

  seller_id: 'user123',
  seller: {
    nickname: '판매자123',
    sales_count: 2,
    purchase_count: 5,
  },
};

// Mock 아이템 리스트 (전체 상품 페이지)
export const mockProductsList = Array.from({ length: 50 }, (_, i) => ({
  item_id: 1000 + i + 1,
  item_name: `제품명 ${i + 1}`,
  item_price: Math.floor(Math.random() * 500000) + 50000,
  category_ids: [
    Math.floor(Math.random() * 3) + 1,
    Math.floor(Math.random() * 6) + 10,
  ],
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

// Mock 카테고리 데이터
export const mockCategories = [
  {
    category_id: 0,
    category_name: '전체',
    children: [
      {
        p_id: 0,
        category_id: 1,
        category_name: '산타페 WIP OG',
        children: [
          { p_id: 1, category_id: 10, category_name: 'J14' },
          { p_id: 1, category_id: 11, category_name: 'J102' },
        ],
      },
      {
        p_id: 0,
        category_id: 2,
        category_name: '디트로이트 OG',
        children: [
          { p_id: 2, category_id: 12, category_name: 'J01' },
          { p_id: 2, category_id: 13, category_name: 'J97' },
          { p_id: 2, category_id: 14, category_name: 'J001' },
        ],
      },
      {
        p_id: 0,
        category_id: 3,
        category_name: '액티브 WIP OG',
        children: [],
      },
    ],
  },
];

// Mock 찜 목록 status data
export const mockWishlistStatus = {
  wished: false,
};
