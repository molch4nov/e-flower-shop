import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import ProductListGrid from "../modules/product-list-grid";
import { Divider, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

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
  const [popularProducts, setPopularProducts] = useState<ProductItem[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<ProductItem[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingTopRated, setLoadingTopRated] = useState(true);
  const [errorPopular, setErrorPopular] = useState<string | null>(null);
  const [errorTopRated, setErrorTopRated] = useState<string | null>(null);

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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Каталог цветов и букетов</h1>
        
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
        <section className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Категории</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div 
              className="bg-primary-100 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:bg-primary-200 transition-colors"
              onClick={() => navigate("/catalog/bouquets")}
            >
              <div className="text-primary mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Букеты</h3>
              <p className="text-center text-default-600">Уникальные цветочные композиции для любого случая</p>
            </div>
            
            <div 
              className="bg-success-100 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:bg-success-200 transition-colors"
              onClick={() => navigate("/catalog/flowers")}
            >
              <div className="text-success mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Цветы</h3>
              <p className="text-center text-default-600">Свежие цветы различных сортов и оттенков</p>
            </div>
            
            <div 
              className="bg-warning-100 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:bg-warning-200 transition-colors"
              onClick={() => navigate("/catalog/gifts")}
            >
              <div className="text-warning mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Подарки</h3>
              <p className="text-center text-default-600">Дополнения к букетам для особых случаев</p>
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
};

export default CatalogPage; 