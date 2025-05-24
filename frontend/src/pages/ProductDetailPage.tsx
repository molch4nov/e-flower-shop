import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { Button, Image, Divider, Chip, Card, CardBody, Spinner } from "@heroui/react";
import { useAuth } from "../providers/AuthProvider";
import { useCart } from "../providers/CartProvider";
import ReviewForm from "../components/ReviewForm";
import api from "@/config/api";

interface File {
  id: string;
  filename: string;
  mimetype: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

interface BouquetFlower {
  id: string;
  flower_id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Review {
  id: string;
  title: string;
  description: string;
  rating: number;
  user_id: string;
  user_name: string;
  created_at: string;
  files?: File[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  purchases_count: number;
  type: "normal" | "bouquet";
  subcategory_id: string;
  subcategory_name: string;
  created_at: string;
  updated_at: string;
  files: File[];
  reviews: Review[];
  flowers?: BouquetFlower[];
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, removeItem, isProductInCart, getProductQuantity, refreshCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [productCartId, setProductCartId] = useState<number | null>(null);
  const [productCartQuantity, setProductCartQuantity] = useState(0);

  // Загрузка данных о товаре
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка при загрузке товара");
        console.error("Ошибка при загрузке товара:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  // Проверяем наличие товара в корзине
  useEffect(() => {
    if (product) {
      const inCart = isProductInCart(product.id);
      setIsInCart(inCart);
      if (inCart) {
        setProductCartQuantity(getProductQuantity(product.id));
        
        // Получаем id элемента корзины для возможности удаления
        const fetchCartItemId = async () => {
          try {
            const data = await api.get("/cart");
            const cartItem = data.items?.find(
              (item: any) => String(item.product_id) === product.id
            );
            if (cartItem) {
              setProductCartId(cartItem.id);
            }
          } catch (error) {
            console.error("Ошибка при получении данных корзины:", error);
          }
        };
        
        fetchCartItemId();
      }
    }
  }, [product]);

  // Добавление товара в корзину
  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    try {
      await addToCart(product.id, quantity);
      
      // Обновляем состояние товара в корзине
      setIsInCart(true);
      await refreshCart(); // Обновляем данные корзины
      setQuantity(1); // Сбрасываем счетчик количества
    } catch (err) {
      console.error("Ошибка при добавлении в корзину:", err);
    }
  };
  
  // Удаление товара из корзины
  const handleRemoveFromCart = async () => {
    if (!productCartId) return;
    
    try {
      await removeItem(productCartId);
      
      // Обновляем состояние
      setIsInCart(false);
      setProductCartQuantity(0);
      setProductCartId(null);
    } catch (err) {
      console.error("Ошибка при удалении из корзины:", err);
    }
  };

  // Рендеринг звезд рейтинга
  const renderRating = (rating: number) => {
    const roundedRating = rating ? parseFloat(Number(rating).toFixed(1)) : 0;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`text-xl ${star <= Math.round(rating) ? "text-yellow-500" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-default-600">
          {roundedRating} из 5
        </span>
      </div>
    );
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  // Получаем URL изображения с fallback
  const getImageUrl = (file: File | undefined) => {
    if (!file) return '/placeholder-image.jpg';
    return `http://localhost:3000/api/files/${file.id}`;
  };

  // Обновление данных товара после добавления отзыва
  const handleReviewSuccess = async () => {
    if (!id) return;
    
    try {
      const data = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error("Ошибка при обновлении данных товара:", err);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </DefaultLayout>
    );
  }

  if (error || !product) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold text-danger mb-4">
            {error || "Товар не найден"}
          </h2>
          <Button 
            color="primary" 
            onClick={() => navigate(-1)}
          >
            Вернуться назад
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="py-6">
        {/* Хлебные крошки */}
        <div className="mb-4 text-sm">
          <span 
            className="text-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            Главная
          </span>
          {" / "}
          <span 
            className="text-primary cursor-pointer"
            onClick={() => navigate(`/catalog/${product.subcategory_id}`)}
          >
            {product.subcategory_name}
          </span>
          {" / "}
          <span className="text-default-600">{product.name}</span>
        </div>

        {/* Основная информация о товаре */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Галерея изображений */}
          <div>
            {product.files && product.files.length > 0 ? (
              <div>
                <div className="mb-4 relative h-[400px] bg-default-100 rounded-lg overflow-hidden">
                  <Image
                    src={getImageUrl(product.files[activeImageIndex])}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    fallbackSrc="/placeholder-image.jpg"
                  />
                  
                  {/* Стрелки навигации по галерее (если больше 1 изображения) */}
                  {product.files.length > 1 && (
                    <>
                      <button 
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 rounded-full p-2"
                        onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.files.length - 1))}
                      >
                        &#10094;
                      </button>
                      <button 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 rounded-full p-2"
                        onClick={() => setActiveImageIndex((prev) => (prev < product.files.length - 1 ? prev + 1 : 0))}
                      >
                        &#10095;
                      </button>
                    </>
                  )}
                </div>
                
                {product.files.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.files.map((file, index) => (
                      <div 
                        key={file.id}
                        className={`cursor-pointer border-2 rounded ${
                          index === activeImageIndex ? "border-primary" : "border-transparent"
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={getImageUrl(file)}
                          alt={`${product.name} - изображение ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                          fallbackSrc="/placeholder-image.jpg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-[400px] bg-default-100 rounded-lg flex items-center justify-center">
                <p>Изображение недоступно</p>
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="mb-4">
              {renderRating(product.rating)}
              <p className="text-sm text-default-600 mt-1">
                {product.reviews?.length || 0} отзывов | {product.purchases_count || 0} покупок
              </p>
            </div>
            
            <p className="text-2xl font-semibold mb-4">
              {product.price.toLocaleString()} ₽
            </p>
            
            <div className="mb-6">
              <p className="text-default-700 whitespace-pre-line">{product.description}</p>
            </div>
            
            {/* Для букетов показываем состав */}
            {product.type === "bouquet" && product.flowers && product.flowers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Состав букета:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {product.flowers.map((flower) => (
                    <li key={flower.id}>
                      {flower.name} - {flower.quantity} шт.
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Форма добавления в корзину */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              {!isInCart ? (
                <>
                  <div className="flex items-center border rounded-md">
                    <Button
                      isIconOnly
                      variant="flat"
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-full"
                    >
                      -
                    </Button>
                    <span className="px-4">{quantity}</span>
                    <Button
                      isIconOnly
                      variant="flat"
                      onPress={() => setQuantity(quantity + 1)}
                      className="h-full"
                    >
                      +
                    </Button>
                  </div>
                  
                  <Button
                    color="primary"
                    size="lg"
                    className="flex-1"
                    onPress={handleAddToCart}
                  >
                    Добавить в корзину
                  </Button>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <div className="p-2 bg-success-100 text-success-700 rounded-md flex items-center gap-2 flex-1">
                    <span>В корзине: {productCartQuantity} шт.</span>
                  </div>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={handleRemoveFromCart}
                  >
                    Удалить из корзины
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => navigate("/cart")}
                  >
                    Перейти в корзину
                  </Button>
                </div>
              )}
            </div>
            
            {/* Дополнительная информация */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Chip>Категория: {product.subcategory_name}</Chip>
              <Chip>Тип: {product.type === "bouquet" ? "Букет" : "Обычный товар"}</Chip>
            </div>
          </div>
        </div>
        
        <Divider className="my-8" />
        
        {/* Секция отзывов */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Отзывы</h2>
          
          {user ? (
            <Button 
              color="primary" 
              className="mb-6"
              onPress={() => setReviewModalOpen(true)}
            >
              Оставить отзыв
            </Button>
          ) : (
            <p className="text-default-600 mb-6">
              Для того чтобы оставить отзыв, пожалуйста, 
              <span 
                className="text-primary cursor-pointer mx-1"
                onClick={() => navigate("/login")}
              >
                войдите
              </span>
              или
              <span 
                className="text-primary cursor-pointer mx-1"
                onClick={() => navigate("/register")}
              >
                зарегистрируйтесь
              </span>
            </p>
          )}
          
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <Card key={review.id}>
                  <CardBody>
                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{review.title}</h3>
                        <p className="text-sm text-default-600">
                          {review.user_name} • {formatDate(review.created_at)}
                        </p>
                      </div>
                      <div>
                        {renderRating(review.rating)}
                      </div>
                    </div>
                    <p className="mt-2">{review.description}</p>
                    
                    {/* Если у отзыва есть прикрепленные файлы - отображаем их */}
                    {review.files && review.files.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.files.map((file) => (
                          <a 
                            key={file.id} 
                            href={getImageUrl(file)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={getImageUrl(file)}
                              alt={`Фото к отзыву ${review.id}`}
                              className="w-20 h-20 object-cover rounded"
                              fallbackSrc="/placeholder-image.jpg"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-default-600">
              У этого товара пока нет отзывов. Будьте первым, кто оставит отзыв!
            </p>
          )}
        </div>
      </div>
      
      {/* Модальное окно добавления отзыва */}
      {id && (
        <ReviewForm
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          productId={id}
          onSuccess={handleReviewSuccess}
        />
      )}
    </DefaultLayout>
  );
} 