import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import ProductListGrid from "../modules/product-list-grid";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import DefaultLayout from "@/layouts/default";

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
];

export default function ProductCatalogPage() {
  const { id: subcategoryId } = useParams();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);

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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  }, [subcategoryId]);

  // Начальная загрузка и сброс при смене подкатегории
  useEffect(() => {
    fetchProducts();
  }, [subcategoryId, fetchProducts]);

  // Фильтрация и сортировка на фронте
  const filteredProducts = products
    .filter(p => (!priceMin || p.price >= priceMin) && (!priceMax || p.price <= priceMax))
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
        default:
          return 0;
      }
    });

  return (
    <DefaultLayout>
      {/* Фильтры сверху */}
      <div className="bg-content1 rounded-large p-4 shadow-medium flex flex-col gap-4 mb-2 max-w-7xl mx-auto">
        <h2 className="text-lg font-semibold mb-2">Фильтры</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <Input 
            type="number" 
            value={priceMin ? String(priceMin) : ""} 
            onChange={e => setPriceMin(Number(e.target.value))} 
            min={0} 
            placeholder="Цена от" 
          />
          <Input 
            type="number" 
            value={priceMax ? String(priceMax) : ""} 
            onChange={e => setPriceMax(Number(e.target.value))} 
            min={0} 
            placeholder="Цена до" 
          />
          <Select
            selectedKeys={[sort]}
            onSelectionChange={keys => setSort(Array.from(keys)[0] as string)}
            label="Сортировка"
          >
            {SORT_OPTIONS.map(opt => (
              <SelectItem key={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto py-6">
        <ProductListGrid products={filteredProducts} loading={loading} />
        {/* Индикатор ошибки */}
        {error && <div className="text-center text-danger py-4">{error}</div>}
        {/* Сообщение о пустом результате */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-6 text-default-500">
            <div>Товары не найдены</div>
            <div className="mt-2">Попробуйте изменить параметры фильтрации</div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
} 