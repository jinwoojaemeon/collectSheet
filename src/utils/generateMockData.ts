import {PRODUCT_CATEGORIES, SUBCATEGORIES} from '@/constants/categories';
import type {MockDataRow} from '@/types/app';

export function generateMockData(count = 10000): MockDataRow[] {
  return Array.from({length: count}).map((_, i) => {
    const category =
      PRODUCT_CATEGORIES[Math.floor(Math.random() * PRODUCT_CATEGORIES.length)];
    const subList = SUBCATEGORIES[category];
    const sub = subList[Math.floor(Math.random() * subList.length)];
    return {
      id: i + 1,
      category,
      subcategory: sub,
      name: `${sub} 상품 ${i + 1}`,
      price: Math.floor(Math.random() * 1000) * 1000 + 1000,
      stock: Math.floor(Math.random() * 500),
      status: Math.random() > 0.2 ? '판매중' : '품절',
      date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    };
  });
}
