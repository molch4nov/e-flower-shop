import React from 'react';
import { ProductCard } from './components/ProductCard';
import { ProductSkeletonGrid } from './components/ProductSkeleton';

interface File {
  id: string;
  filename: string;
  mimetype: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  files: File[];
  rating?: number;
  ratingCount?: number;
  isNew?: boolean;
}

interface ProductListGridProps {
  products: Product[];
  loading?: boolean;
}

const ProductListGrid: React.FC<ProductListGridProps> = ({ products, loading = false }) => {
  if (loading) {
    return <ProductSkeletonGrid />;
  }

  return (
    <div className="w-full">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-xl bg-content1/30">
          <svg className="w-16 h-16 mb-4 text-default-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-xl font-medium text-default-600">Товары не найдены</p>
          <p className="mt-2 text-default-400">Попробуйте изменить параметры фильтрации</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListGrid;