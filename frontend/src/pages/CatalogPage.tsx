import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import ProductListGrid from "../modules/product-list-grid";
import { Divider, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";

interface File {
  id: string;
  filename: string;
  mimetype: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  files: File[];
  rating?: number;
  ratingCount?: number;
  isNew?: boolean;
}

const CatalogPage = () => {
  const navigate = useNavigate();
  const { refreshCart, isLoading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [popularProducts, setPopularProducts] = useState<ProductItem[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<ProductItem[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingTopRated, setLoadingTopRated] = useState(true);
  const [errorPopular, setErrorPopular] = useState<string | null>(null);
  const [errorTopRated, setErrorTopRated] = useState<string | null>(null);

  // Обновляем состояние корзины при загрузке страницы
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [refreshCart, isAuthenticated]);

  // Загрузка популярных товаров
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoadingPopular(true);
        setErrorPopular(null);
        
        const response = await fetch("http://localhost:3000/api/products/popular");
        
        if (!response.ok) {
          throw new Error("Не удалось загрузить популярные товары");
        }
        
        const data = await response.json();
        // Преобразуем данные от API в нужный формат
        const formattedData: ProductItem[] = data.map((item: any) => ({
          ...item,
          files: item.files || [], // Убедимся, что файлы всегда существуют как массив
        }));
        
        setPopularProducts(formattedData);
      } catch (err) {
        setErrorPopular(err instanceof Error ? err.message : "Неизвестная ошибка");
        console.error("Ошибка при загрузке популярных товаров:", err);
      } finally {
        setLoadingPopular(false);
      }
    };

    fetchPopularProducts();
  }, []);

  // Загрузка товаров с высоким рейтингом
  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        setLoadingTopRated(true);
        setErrorTopRated(null);
        
        const response = await fetch("http://localhost:3000/api/products/top-rated");
        
        if (!response.ok) {
          throw new Error("Не удалось загрузить товары с высоким рейтингом");
        }
        
        const data = await response.json();
        // Преобразуем данные от API в нужный формат
        const formattedData: ProductItem[] = data.map((item: any) => ({
          ...item,
          files: item.files || [], // Убедимся, что файлы всегда существуют как массив
        }));
        
        setTopRatedProducts(formattedData);
      } catch (err) {
        setErrorTopRated(err instanceof Error ? err.message : "Неизвестная ошибка");
        console.error("Ошибка при загрузке товаров с высоким рейтингом:", err);
      } finally {
        setLoadingTopRated(false);
      }
    };

    fetchTopRatedProducts();
  }, []);

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">        
        {/* Раздел с популярными товарами */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Популярные товары</h2>
            <Button 
              variant="flat" 
              color="primary"
              onClick={() => navigate("/catalog/all?sort=popular")}
            >
              Смотреть все
            </Button>
          </div>
          
          <div className="bg-default-50 rounded-xl p-6">
            {errorPopular ? (
              <div className="text-center text-danger py-4 my-4 bg-danger-50 rounded-xl">
                {errorPopular}
              </div>
            ) : (
              <ProductListGrid products={popularProducts} loading={loadingPopular} />
            )}
          </div>
        </section>
        
        <Divider className="my-8" />
        
        {/* Раздел с товарами с высоким рейтингом */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Товары с высоким рейтингом</h2>
            <Button 
              variant="flat" 
              color="primary"
              onClick={() => navigate("/catalog/all?sort=rating_desc")}
            >
              Смотреть все
            </Button>
          </div>
          
          <div className="bg-default-50 rounded-xl p-6">
            {errorTopRated ? (
              <div className="text-center text-danger py-4 my-4 bg-danger-50 rounded-xl">
                {errorTopRated}
              </div>
            ) : (
              <ProductListGrid products={topRatedProducts} loading={loadingTopRated} />
            )}
          </div>
        </section>
        
        {/* Категории букетов и цветов */}
        
      </div>
    </DefaultLayout>
  );
};

export default CatalogPage; 