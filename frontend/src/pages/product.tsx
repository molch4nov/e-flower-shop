import { useParams } from "react-router-dom";
import { Button, Chip, Divider } from "@heroui/react";
import { useCart } from "@/context/CartContext";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, isLoading } = useCart();

  // Здесь будет запрос к API для получения данных товара
  const product = {
    id: id || "1",
    name: "Пример букета 'Весенние цветы'",
    description: "Красивый букет из весенних цветов. Идеально подходит для подарка или украшения интерьера. В состав букета входят тюльпаны, нарциссы и другие сезонные цветы.",
    price: 3500,
    type: "bouquet",
    rating: 4.7,
    files: [],
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product.id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-100 rounded-lg h-80 md:h-[500px] flex items-center justify-center">
        <span className="text-gray-500">Изображение товара</span>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.type === "bouquet" && (
              <Chip color="primary" variant="flat" size="sm">Букет</Chip>
            )}
            <span className="text-sm text-gray-500">ID: {product.id}</span>
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-yellow-400">
              {Array(5).fill(0).map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-none'}`} 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
            </div>
            <span className="text-sm">{product.rating} / 5</span>
          </div>
        </div>

        <div className="text-2xl font-bold">{formatPrice(product.price)}</div>

        <div>
          <Button 
            color="primary" 
            size="lg" 
            className="w-full sm:w-auto" 
            onClick={handleAddToCart}
            isLoading={isLoading}
          >
            Добавить в корзину
          </Button>
        </div>

        <Divider />

        <div>
          <h2 className="text-lg font-semibold mb-2">Описание</h2>
          <p className="text-gray-600">{product.description}</p>
        </div>

        {product.type === "bouquet" && (
          <>
            <Divider />
            <div>
              <h2 className="text-lg font-semibold mb-4">Состав букета</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 border rounded-md">
                  <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                  <div>
                    <div className="font-medium">Тюльпаны</div>
                    <div className="text-sm text-gray-500">5 шт.</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 border rounded-md">
                  <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                  <div>
                    <div className="font-medium">Нарциссы</div>
                    <div className="text-sm text-gray-500">3 шт.</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage; 