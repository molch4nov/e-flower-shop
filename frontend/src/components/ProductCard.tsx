import { Card, CardBody, CardFooter, Button, Chip } from "@heroui/react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    type: string;
    files?: { id: string; filename: string }[];
    rating?: number;
  };
  showAddToCart?: boolean;
}

const ProductCard = ({ product, showAddToCart = true }: ProductCardProps) => {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Изображение товара (по умолчанию или первое из файлов)
  const imageUrl = product.files && product.files.length > 0
    ? `/api/files/${product.files[0].id}`
    : "https://via.placeholder.com/300x300?text=Нет+фото";

  return (
    <Card 
      as={Link} 
      to={`/product/${product.id}`}
      isPressable
      className="overflow-hidden h-full hover:shadow-md transition-shadow"
    >
      <CardBody className="p-0 overflow-hidden">
        <div className="relative aspect-square">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.type === "bouquet" && (
            <Chip
              color="primary"
              variant="flat"
              className="absolute top-2 right-2"
              size="sm"
            >
              Букет
            </Chip>
          )}
        </div>
      </CardBody>
      <CardFooter className="flex flex-col items-start gap-2 p-4">
        <h3 className="font-medium text-lg line-clamp-2">{product.name}</h3>
        <div className="flex justify-between items-center w-full">
          <span className="font-bold text-lg">{formatPrice(product.price)}</span>
          {showAddToCart && (
            <Button
              isIconOnly
              color="primary"
              size="sm"
              variant="light"
              onClick={handleAddToCart}
              isLoading={isLoading}
              aria-label="Добавить в корзину"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 01-8 0"></path>
              </svg>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard; 