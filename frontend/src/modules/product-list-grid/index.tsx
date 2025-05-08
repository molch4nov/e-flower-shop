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
    <div className="grid w-full max-w-7xl mx-auto gap-6 justify-center
      grid-cols-[repeat(auto-fill,minmax(280px,1fr))]
      sm:grid-cols-[repeat(2,280px)]
      md:grid-cols-[repeat(3,280px)]
      lg:grid-cols-[repeat(4,280px)]">
      {products.map((product) => (
        <div key={product.id} className="flex justify-center items-start">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductListGrid;