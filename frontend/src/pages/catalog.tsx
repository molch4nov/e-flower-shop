import { useState } from "react";
import { Button } from "@heroui/react";
import { Link, useSearchParams } from "react-router-dom";
import CategoryList from "@/components/ui/CategoryList";
import { useCategories } from "@/hooks/useCategories";
import { useQuery } from "@tanstack/react-query";
import api from "@/config/api";

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("category") || "";
  const subcategoryId = searchParams.get("subcategory") || "";
  
  // Получаем категории с бэкенда (для отладки)
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  // Получаем товары на основе выбранной категории или подкатегории
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products", { categoryId, subcategoryId }],
    queryFn: async () => {
      let response;
      if (subcategoryId) {
        response = await api.products.getBySubcategory(subcategoryId);
      } else if (categoryId) {
        // Здесь мы получаем все товары категории, в дальнейшем можно добавить отдельный API
        const subcategories = await api.categories.getSubcategories(categoryId);
        const subIds = subcategories.data.map((sub: any) => sub.id);
        
        // Получаем товары по каждой подкатегории
        const allProducts = [];
        for (const id of subIds) {
          const result = await api.products.getBySubcategory(id);
          allProducts.push(...result.data);
        }
        return allProducts;
      } else {
        response = await api.products.getAll();
      }
      return response?.data || [];
    },
  });
  
  // Обработчики выбора категории и подкатегории
  const handleCategorySelect = (id: string) => {
    if (id) {
      searchParams.set("category", id);
      searchParams.delete("subcategory");
    } else {
      searchParams.delete("category");
      searchParams.delete("subcategory");
    }
    setSearchParams(searchParams);
  };
  
  const handleSubcategorySelect = (id: string) => {
    searchParams.set("subcategory", id);
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Каталог товаров</h1>
        <div className="flex gap-2">
          <Button variant="flat" color="default" size="sm">
            По популярности
          </Button>
          <Button variant="flat" color="default" size="sm">
            По цене
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-medium mb-4">Категории</h2>
            <CategoryList 
              onSelectCategory={handleCategorySelect} 
              onSelectSubcategory={handleSubcategorySelect}
            />
          </div>
        </div>
        
        <div className="md:col-span-3">
          {productsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Загрузка товаров...</p>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">Товары не найдены</h2>
              <p className="text-gray-500 mb-6">
                По данному запросу товары не найдены. Попробуйте выбрать другую категорию.
              </p>
              <Button 
                onClick={() => {
                  searchParams.delete("category");
                  searchParams.delete("subcategory");
                  setSearchParams(searchParams);
                }}
                color="primary"
              >
                Показать все товары
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product: any, index: number) => (
                  <div 
                    key={product.id || index} 
                    className="bg-gray-100 p-4 rounded-lg flex flex-col h-80 justify-center items-center text-gray-500"
                  >
                    {product.name || `Товар ${index + 1}`}
                  </div>
                ))}
              </div>
              
              {products.length >= 6 && (
                <div className="mt-8 flex justify-center">
                  <Button variant="flat" color="primary">
                    Загрузить еще
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage; 