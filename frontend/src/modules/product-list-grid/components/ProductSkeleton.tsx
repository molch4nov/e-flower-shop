import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-content1 rounded-xl overflow-hidden shadow-sm h-full max-w-xs w-full">
      {/* Скелет изображения */}
      <div className="relative aspect-square w-full">
        <div className="absolute inset-0 bg-default-200 animate-pulse"></div>
      </div>
      
      {/* Скелет контента */}
      <div className="flex flex-col p-3 flex-grow">
        {/* Скелет названия */}
        <div className="w-full h-4 bg-default-200 animate-pulse rounded mb-1"></div>
        <div className="w-2/3 h-4 bg-default-200 animate-pulse rounded mt-1 mb-2"></div>
        
        {/* Скелет рейтинга */}
        <div className="flex gap-1 mt-1 h-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-default-200 animate-pulse rounded-full"></div>
          ))}
        </div>
        
        {/* Скелет цены и кнопки */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-default-200">
          <div className="w-16 h-5 bg-default-200 animate-pulse rounded"></div>
          <div className="w-20 h-7 bg-default-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full justify-items-center">
      {Array.from({ length: 10 }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}; 