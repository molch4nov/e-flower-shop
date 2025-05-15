import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import ProductListGrid from "../modules/product-list-grid";
import { Button, Chip, Select, SelectItem, Pagination } from "@heroui/react";

interface File {
  id: string;
  filename: string;
  mimetype: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

// Адаптировано под API и ProductCard
interface ProductItem {
  id: string;
  name: string;
  price: number;
  files: File[];
  rating?: number;
  ratingCount?: number;
  isNew?: boolean;
  // Дополнительные поля, которые могут присутствовать в API, но не используются в ProductCard
  href?: string;
  color?: string;
  size?: string;
  description?: string;
  imageSrc?: string;
}

const SORT_OPTIONS = [
  { value: "price_asc", label: "Сначала дешевые" },
  { value: "price_desc", label: "Сначала дорогие" },
  { value: "rating_desc", label: "По рейтингу" },
  { value: "popular", label: "По популярности" },
  { value: "newest", label: "Сначала новинки" },
];

const ITEMS_PER_LOAD = 10;

export default function AllProductsCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState(searchParams.get("sort") || SORT_OPTIONS[0].value);
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [filterIsNew, setFilterIsNew] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageTitle, setPageTitle] = useState("Все товары");

  // Обработка изменения параметров URL
  useEffect(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      setSort(sortParam);
      
      // Установка заголовка страницы в зависимости от сортировки
      if (sortParam === "popular") {
        setPageTitle("Популярные товары");
      } else if (sortParam === "rating_desc") {
        setPageTitle("Товары с высоким рейтингом");
      } else {
        setPageTitle("Все товары");
      }
    }
  }, [searchParams]);

  // Загрузка товаров с лимитом и смещением
  const fetchProducts = useCallback(async (offset = 0, append = false) => {
    if (loading || (loadingMore && append)) return;
    
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setProducts([]);
    }
    
    setError(null);
    
    try {
      const apiEndpoint = sort === "popular" 
        ? "http://localhost:3000/api/products/popular" 
        : sort === "rating_desc" 
          ? "http://localhost:3000/api/products/top-rated"
          : "http://localhost:3000/api/products/popular"; // Временно используем popular для всех случаев
      
      const limit = ITEMS_PER_LOAD;
      const url = `${apiEndpoint}?limit=${limit}&offset=${offset}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Ошибка загрузки товаров");
      const data = await res.json();

      // Преобразуем данные от API в нужный формат
      const formattedData: ProductItem[] = data.map((item: any) => ({
        ...item,
        files: item.files || [], // Убедимся, что файлы всегда существуют как массив
      }));

      if (append) {
        setProducts(prev => [...prev, ...formattedData]);
      } else {
        setProducts(formattedData);
      }
      
      // Если вернулось меньше товаров, чем запрошено, значит больше нет
      setHasMore(formattedData.length === limit);
      
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки товаров");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sort, loading, loadingMore]);

  // Начальная загрузка при монтировании или изменении параметров сортировки
  useEffect(() => {
    fetchProducts(0, false);
  }, [fetchProducts, sort]);

  // Настройка Intersection Observer для бесконечной прокрутки
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // Если элемент виден и у нас есть еще товары для загрузки
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchProducts(products.length, true);
        }
      },
      { threshold: 0.5 }
    );
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [products.length, hasMore, fetchProducts, loading, loadingMore]);

  // Обработчик изменения сортировки
  const handleSortChange = (sortValue: string) => {
    setSort(sortValue);
    // Обновляем URL параметры
    searchParams.set("sort", sortValue);
    setSearchParams(searchParams);
    // Сбрасываем состояние и загружаем товары заново
    setProducts([]);
    setHasMore(true);
  };

  // Фильтрация на фронте (для дополнительных фильтров)
  const filteredProducts = products
    .filter(p => (!priceMin || p.price >= priceMin) && 
                (!priceMax || p.price <= priceMax) &&
                (!filterIsNew || p.isNew));

  // Сброс всех фильтров
  const resetFilters = () => {
    setPriceMin(null);
    setPriceMax(null);
    setFilterIsNew(false);
  };

  // Определить, применены ли какие-либо фильтры
  const hasActiveFilters = priceMin !== null || priceMax !== null || filterIsNew;

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Заголовок страницы */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-default-900">
            {pageTitle}
          </h1>
          <p className="text-sm sm:text-base text-default-500 mt-1">
            Найдено товаров: {products.length}{loading ? "..." : ""}
            {hasMore ? "+" : ""}
          </p>
        </div>

        {/* Мобильная кнопка для фильтров */}
        <div className="lg:hidden mb-3 sticky top-0 z-20 bg-background pb-2 pt-1 border-default-200">
          <Button 
            onClick={() => setFiltersVisible(!filtersVisible)}
            variant="flat"
            color="primary"
            className="w-full flex justify-between"
          >
            <span>Фильтры и сортировка</span>
            <span>{filtersVisible ? "↑" : "↓"}</span>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Блок фильтров */}
          <div className={`w-full lg:w-64 ${filtersVisible ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-content1 rounded-xl p-4 sticky top-16">
              <div className="mb-4">
                <h3 className="font-medium mb-3">Сортировка</h3>
                <Select
                  selectedKeys={[sort]}
                  onSelectionChange={(keys) => handleSortChange(Array.from(keys)[0] as string)}
                  className="w-full"
                >
                  {SORT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-3">Цена</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    className="w-full p-2 border rounded-md"
                    value={priceMin ?? ''}
                    onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : null)}
                  />
                  <input
                    type="number"
                    placeholder="До"
                    className="w-full p-2 border rounded-md"
                    value={priceMax ?? ''}
                    onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-3">Дополнительно</h3>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterIsNew}
                      onChange={(e) => setFilterIsNew(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span>Только новинки</span>
                  </label>
                </div>
              </div>
              
              {hasActiveFilters && (
                <Button
                  color="danger"
                  variant="light"
                  className="w-full"
                  onClick={resetFilters}
                >
                  Сбросить фильтры
                </Button>
              )}
            </div>
          </div>

          {/* Основной контент */}
          <div className="flex-1">
            {/* Активные фильтры */}
            {hasActiveFilters && (
              <div className="mb-4 flex flex-wrap gap-2">
                {priceMin !== null && (
                  <Chip 
                    variant="flat" 
                    onClose={() => setPriceMin(null)}
                  >
                    От {priceMin} ₽
                  </Chip>
                )}
                {priceMax !== null && (
                  <Chip 
                    variant="flat" 
                    onClose={() => setPriceMax(null)}
                  >
                    До {priceMax} ₽
                  </Chip>
                )}
                {filterIsNew && (
                  <Chip 
                    variant="flat" 
                    color="primary"
                    onClose={() => setFilterIsNew(false)}
                  >
                    Только новинки
                  </Chip>
                )}
              </div>
            )}

            {/* Список товаров */}
            <ProductListGrid products={filteredProducts} loading={loading && products.length === 0} />
            
            {/* Индикатор ошибки */}
            {error && (
              <div className="text-center text-danger py-4 my-4 bg-danger-50 rounded-xl">
                {error}
              </div>
            )}
            
            {/* Индикатор загрузки при подгрузке */}
            {loadingMore && (
              <div className="text-center py-4 my-4">
                Загрузка товаров...
              </div>
            )}
            
            {/* Элемент для отслеживания прокрутки */}
            <div ref={observerTarget} className="h-20 mb-4"></div>
            
            {/* Сообщение о конце списка */}
            {!hasMore && products.length > 0 && (
              <div className="text-center text-default-500 py-4 my-4">
                Больше товаров нет
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
} 