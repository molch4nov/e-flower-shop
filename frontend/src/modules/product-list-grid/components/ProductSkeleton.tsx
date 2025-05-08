import React from 'react';
import { Card, CardBody, CardFooter, Skeleton } from "@heroui/react";

export const ProductSkeleton: React.FC = () => {
  return (
    <Card className="w-[280px] h-[400px]">
      <CardBody className="p-0 overflow-hidden">
        <div className="w-full h-[220px] relative">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      </CardBody>
      <CardFooter className="flex flex-col items-start gap-2 p-4 h-[180px]">
        <Skeleton className="w-3/4 h-6 rounded-lg" />
        <Skeleton className="w-1/2 h-4 rounded-lg" />
        <Skeleton className="w-1/3 h-6 rounded-lg mt-auto" />
      </CardFooter>
    </Card>
  );
};

export const ProductSkeletonGrid: React.FC = () => {
  return (
    <div className="grid w-full max-w-7xl mx-auto gap-6 justify-center
      grid-cols-[repeat(auto-fill,minmax(280px,1fr))]
      sm:grid-cols-[repeat(2,280px)]
      md:grid-cols-[repeat(3,280px)]
      lg:grid-cols-[repeat(4,280px)]">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex justify-center items-start">
          <ProductSkeleton key={index} />
        </div>
      ))}
    </div>
  );
}; 