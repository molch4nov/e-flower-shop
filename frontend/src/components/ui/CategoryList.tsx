import { useState } from "react";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { useCategories, Category } from "@/hooks/useCategories";

interface CategoryListProps {
  onSelectCategory?: (categoryId: string) => void;
  onSelectSubcategory?: (subcategoryId: string) => void;
  className?: string;
}

const CategoryList = ({ 
  onSelectCategory, 
  onSelectSubcategory, 
  className = "" 
}: CategoryListProps) => {
  const { data: categories, isLoading, error } = useCategories();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
  };

  // Отображаем состояние загрузки
  if (isLoading) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-gray-500">Загрузка категорий...</p>
      </div>
    );
  }

  // Отображаем ошибку, если она есть
  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-danger">Ошибка загрузки категорий</p>
      </div>
    );
  }

  // Отображаем сообщение, если категорий нет
  if (!categories || categories.length === 0) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-gray-500">Категории не найдены</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Button 
        variant="light"
        color={expandedCategory === null ? "primary" : "default"}
        className="w-full justify-start"
        onClick={() => {
          setExpandedCategory(null);
          if (onSelectCategory) onSelectCategory("");
        }}
      >
        Все категории
      </Button>
      
      {categories.map((category: Category) => (
        <div key={category.id} className="space-y-1">
          <Button
            variant="light"
            color={expandedCategory === category.id ? "primary" : "default"}
            className="w-full justify-start"
            onClick={() => toggleCategory(category.id)}
          >
            {category.name}
          </Button>
          
          {expandedCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
            <div className="pl-4 space-y-1">
              {category.subcategories.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant="light"
                  size="sm"
                  color="default"
                  className="w-full justify-start"
                  onClick={() => {
                    if (onSelectSubcategory) onSelectSubcategory(subcategory.id);
                  }}
                >
                  {subcategory.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryList; 