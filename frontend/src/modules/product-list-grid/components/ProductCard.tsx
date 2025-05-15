import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Tooltip } from "@heroui/react";
import { useCart } from '@/providers/CartProvider';

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
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const { addToCart, removeItem, isProductInCart, getProductQuantity, refreshCart } = useCart();
  const [isInCart, setIsInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState<number | null>(null);
  const [productCartQuantity, setProductCartQuantity] = useState(0);

  // Получаем URL изображения
  const getImageUrl = (file: File | undefined) => {
    if (!file) return '/placeholder-image.jpg';
    return `http://localhost:3000/api/files/${file.id}`;
  };

  const imageUrl = product.files && product.files.length > 0
    ? getImageUrl(product.files[0])
    : '/placeholder-image.jpg';

  // Второе изображение для эффекта наведения (если доступно)
  const secondImageUrl = product.files && product.files.length > 1
    ? getImageUrl(product.files[1])
    : imageUrl;

  // Форматируем цену с пробелами
  const formattedPrice = Number(product.price).toLocaleString('ru-RU');

  // Рейтинг в виде звезд
  const renderStars = () => {
    if (!product.rating) return null;
    
    const stars = [];
    const rating = Math.round(product.rating * 2) / 2; // Округляем до ближайшего 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else if (i - 0.5 === rating) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-default-500 ml-1">
          {product.ratingCount ? `(${product.ratingCount})` : ''}
        </span>
      </div>
    );
  };

  // Проверяем наличие товара в корзине
  useEffect(() => {
    const checkCartStatus = async () => {
      const inCart = isProductInCart(product.id);
      setIsInCart(inCart);
      
      if (inCart) {
        setProductCartQuantity(getProductQuantity(product.id));
        
        // Получаем id элемента корзины для возможности удаления
        try {
          const response = await fetch("http://localhost:3000/api/cart", {
            credentials: "include",
          });
          
          if (response.ok) {
            const data = await response.json();
            const cartItem = data.items?.find(
              (item: any) => item.product_id === Number(product.id)
            );
            if (cartItem) {
              setCartItemId(cartItem.id);
            }
          }
        } catch (error) {
          console.error("Ошибка при получении данных корзины:", error);
        }
      }
    };
    
    checkCartStatus();
  }, [product.id]);

  // Функция добавления в корзину
  const handleAddToCart = async (e: React.MouseEvent | any) => {
    // Если вызывается через onPress кнопки, e может быть не MouseEvent
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault(); // Предотвращаем переход по ссылке
      e.stopPropagation(); // Останавливаем всплытие события
    }
    
    try {
      await addToCart(product.id, 1);
      
      // Обновляем состояние
      setIsInCart(true);
      await refreshCart();
    } catch (err) {
      console.error("Ошибка при добавлении в корзину:", err);
    }
  };
  
  // Функция удаления из корзины
  const handleRemoveFromCart = async (e: React.MouseEvent | any) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!cartItemId) return;
    
    try {
      await removeItem(cartItemId);
      
      // Обновляем состояние
      setIsInCart(false);
      setProductCartQuantity(0);
      setCartItemId(null);
    } catch (err) {
      console.error("Ошибка при удалении из корзины:", err);
    }
  };

  // Обработка ошибки загрузки изображения
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsImageError(true);
    e.currentTarget.src = '/placeholder-image.jpg';
  };

  return (
    <div 
      className="group relative flex flex-col bg-content1 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full max-w-xs mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Бейдж "Новинка" */}
      {product.isNew && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
          <span className="px-2 sm:px-3 py-1 text-xs font-medium text-white bg-primary rounded-full shadow-md">
            Новинка
          </span>
        </div>
      )}
      
      {/* Бейдж "В корзине" */}
      {isInCart && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
          <span className="px-2 sm:px-3 py-1 text-xs font-medium text-white bg-success rounded-full shadow-md flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            В корзине
          </span>
        </div>
      )}
      
      {/* Изображение */}
      <Link to={`/product/${product.id}`} className="relative overflow-hidden w-full aspect-square">
        <div className="absolute inset-0 bg-gray-100 animate-pulse" 
             style={{ opacity: isImageLoaded ? 0 : 1 }} />
        
        {/* Основное изображение */}
        <img
          src={!isImageError ? imageUrl : '/placeholder-image.jpg'}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isHovered && product.files.length > 1 ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsImageLoaded(true)}
          onError={handleImageError}
        />
        
        {/* Второе изображение (показывается при наведении) */}
        {product.files.length > 1 && (
          <img
            src={secondImageUrl}
            alt={`${product.name} (вид 2)`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImageError}
          />
        )}
      </Link>
      
      {/* Информация о товаре */}
      <div className="flex flex-col p-3 flex-grow">
        <Link to={`/product/${product.id}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-medium text-sm text-default-800 line-clamp-2 h-10">
            {product.name}
          </h3>
        </Link>
        
        {/* Рейтинг */}
        <div className="mt-1 h-5">{renderStars()}</div>
        
        {/* Ценник и кнопка */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-default-200">
          <div className="text-base font-bold text-primary">{formattedPrice} ₽</div>
          
          {!isInCart ? (
            <Button 
              size="sm" 
              color="primary" 
              variant="flat"
              className="min-w-0 px-2 text-xs"
              onPress={handleAddToCart}
            >
              В корзину
            </Button>
          ) : (
            <Button 
              size="sm" 
              color="danger" 
              variant="flat"
              className="min-w-0 px-2 text-xs"
              onPress={handleRemoveFromCart}
            >
              Удалить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 