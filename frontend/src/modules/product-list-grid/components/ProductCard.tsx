import React from 'react';
import { Card, CardBody, CardFooter, Image } from "@heroui/react";

interface File {
  id: string;
  filename: string;
  mimetype: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    files: File[];
    rating?: number;
    ratingCount?: number;
    isNew?: boolean;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.files && product.files.length > 0
    ? `http://localhost:3000/api/files/${product.files[0].id}`
    : '/placeholder-image.jpg'; // Заглушка по умолчанию

  return (
    <Card 
      isPressable 
      className="w-[280px] h-[400px] hover:scale-105 transition-transform duration-200"
    >
      <CardBody className="p-0 w-[280px] h-[400px] overflow-hidden">
        <div className="w-full h-[220px] relative bg-default-100">
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            height="100%"
            alt={product.name}
            className="w-full h-full object-cover"
            src={imageUrl}
            fallbackSrc="/placeholder-image.jpg"
          />
        </div>
      </CardBody>
      <CardFooter className="flex flex-col items-start gap-2 p-4 h-[180px]">
        <div className="flex justify-between w-full">
          <h4 className="text-lg font-semibold line-clamp-2">{product.name}</h4>
          {product.isNew && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-primary rounded-full">
              Новинка
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {product.rating && Number(product.rating) > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-warning">★</span>
              <span className="text-sm text-default-500">{Number(product.rating).toFixed(1)}</span>
            </div>
          )}
          {product.ratingCount && product.ratingCount > 0 && (
            <span className="text-sm text-default-500">({product.ratingCount})</span>
          )}
        </div>
        <p className="text-xl font-bold text-primary mt-auto">{Number(product.price).toLocaleString()} ₽</p>
      </CardFooter>
    </Card>
  );
}; 