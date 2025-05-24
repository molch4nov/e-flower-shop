import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import ProductListGrid from "../modules/product-list-grid";
import { Button, Input, Select, SelectItem, Chip, Pagination } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
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

const ITEMS_PER_PAGE = 12;

export default function ProductCatalogPage() {
  const { id: subcategoryId } = useParams();
  const { refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [filterIsNew, setFilterIsNew] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [subcategoryName, setSubcategoryName] = useState("");

  // Обновляем состояние корзины при загрузке страницы
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [refreshCart, isAuthenticated]);

  // Загрузка товаров
  const fetchProducts = useCallback(async () => {
    if (!subcategoryId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/products/subcategory/${subcategoryId}`);
      if (!res.ok) throw new Error("Ошибка загрузки товаров");
      const data = await res.json();

      // Преобразуем данные от API в нужный формат
      const formattedData: ProductItem[] = data.map((item: any) => ({
        ...item,
        files: item.files || [], // Убедимся, что файлы всегда существуют как массив
      }));

      setProducts(formattedData);
      
      // Получаем название подкатегории (можно заменить на реальный API-запрос)
      try {
        const catRes = await fetch(`http://localhost:3000/api/subcategories/${subcategoryId}`);
        if (catRes.ok) {
          const catData = await catRes.json();
          setSubcategoryName(catData.name);
        }
      } catch (e) {
        console.error("Не удалось получить название подкатегории", e);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  }, [subcategoryId]);

  // Начальная загрузка и сброс при смене подкатегории
  useEffect(() => {
    fetchProducts();
    setCurrentPage(1); // Сбрасываем страницу при смене подкатегории
    // Сбрасываем фильтры
    setPriceMin(null);
    setPriceMax(null);
    setFilterIsNew(false);
    setSort(SORT_OPTIONS[0].value);
  }, [subcategoryId, fetchProducts]);

  // Фильтрация и сортировка на фронте
  const filteredProducts = products
    .filter(p => (!priceMin || p.price >= priceMin) && 
                (!priceMax || p.price <= priceMax) &&
                (!filterIsNew || p.isNew))
    .sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "rating_desc":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "popular":
          return (b.ratingCount ?? 0) - (a.ratingCount ?? 0);
        case "newest":
          return ((a.isNew ? 1 : 0) - (b.isNew ? 1 : 0)) * -1; // Сначала новинки
        default:
          return 0;
      }
    });

  // Пагинация
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Сброс всех фильтров
  const resetFilters = () => {
    setPriceMin(null);
    setPriceMax(null);
    setFilterIsNew(false);
    setSort(SORT_OPTIONS[0].value);
    setCurrentPage(1);
  };

  // Определить, применены ли какие-либо фильтры
  const hasActiveFilters = priceMin !== null || priceMax !== null || filterIsNew;

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Заголовок страницы */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-default-900">
            {subcategoryName || "Каталог товаров"}
          </h1>
          <p className="text-sm sm:text-base text-default-500 mt-1">
            Найдено товаров: {filteredProducts.length}
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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Боковая панель с фильтрами */}
          <div className={`w-full lg:w-64 shrink-0 ${filtersVisible || 'hidden lg:block'} ${filtersVisible ? 'sticky top-[104px] z-10 mb-3' : ''}`}>
            <div className="bg-content1 rounded-xl p-4 shadow-sm lg:sticky lg:top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Фильтры</h2>
                {hasActiveFilters && (
                  <Button 
                    size="sm" 
                    variant="light" 
                    color="danger"
                    onClick={resetFilters}
                  >
                    Сбросить
                  </Button>
                )}
              </div>

              {/* Фильтр по цене */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Цена</h3>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="От"
                    min={0}
                    value={priceMin !== null ? String(priceMin) : ""}
                    onChange={e => setPriceMin(e.target.value ? Number(e.target.value) : null)}
                  />
                  <Input
                    type="number"
                    placeholder="До"
                    min={0}
                    value={priceMax !== null ? String(priceMax) : ""}
                    onChange={e => setPriceMax(e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>

              {/* Сортировка */}
              <div>
                <h3 className="font-medium mb-3">Сортировка</h3>
                <Select
                  selectedKeys={[sort]}
                  onSelectionChange={keys => setSort(Array.from(keys)[0] as string)}
                  className="w-full"
                >
                  {SORT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
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
            <ProductListGrid products={displayedProducts} loading={loading} />
            
            {/* Индикатор ошибки */}
            {error && (
              <div className="text-center text-danger py-4 my-4 bg-danger-50 rounded-xl">
                {error}
              </div>
            )}
            
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
} 