export const PRODUCT_CATEGORIES = ['전자제품', '의류', '식품', '생활용품'] as const;

export const SUBCATEGORIES: Record<string, string[]> = {
  전자제품: ['스마트폰', '노트북', '액세서리'],
  의류: ['남성복', '여성복', '아동복'],
  식품: ['신선식품', '가공식품', '음료'],
  생활용품: ['주방용품', '욕실용품', '청소용품'],
};

export const CATEGORY_FILTER_OPTIONS = [
  '전체',
  ...PRODUCT_CATEGORIES,
] as const;
