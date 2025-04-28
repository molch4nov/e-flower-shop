import { useQuery } from "@tanstack/react-query";
import api from "@/config/api";

// Типы данных
export interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
  files?: Array<{ id: string; filename: string }>;
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  files?: Array<{ id: string; filename: string }>;
}

// Хук для получения всех категорий
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.categories.getAll();
      return response.data as Category[];
    }
  });
};

// Хук для получения всех подкатегорий
export const useSubcategories = () => {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const response = await api.categories.getAllSubcategories();
      return response.data as Subcategory[];
    }
  });
};

// Хук для получения подкатегорий конкретной категории
export const useSubcategoriesByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      const response = await api.categories.getSubcategories(categoryId);
      return response.data as Subcategory[];
    },
    enabled: !!categoryId // Запрос выполняется только если есть categoryId
  });
};

export default useCategories; 