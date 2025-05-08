import { useState, useEffect } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerBody, 
  DrawerFooter 
} from "@heroui/drawer";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter 
} from "@heroui/card";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

// Временные изображения для категорий и подкатегорий
const categoryImages = {
  "Букеты": "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?q=80&w=1000",
  "Цветы": "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?q=80&w=1000",
  "Композиции": "https://images.unsplash.com/photo-1582798358481-1993b5d2b1f3?q=80&w=1000",
  "Подарки": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1000",
  "default": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1000"
};

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
}

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryDrawer = ({ isOpen, onClose }: CategoryDrawerProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'categories' | 'subcategories'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  // Загрузка категорий
  useEffect(() => {
    if (isOpen && view === 'categories') {
      setLoading(true);
      setError(null);
      fetch('http://localhost:3000/api/categories')
        .then(res => {
          const contentType = res.headers.get('content-type');
          if (!res.ok) throw new Error('Не удалось загрузить категории');
          if (!contentType || !contentType.includes('application/json')) throw new Error('Ошибка сервера: получен неожиданный ответ');
          return res.json();
        })
        .then(setCategories)
        .catch(err => {
          setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке категорий');
          setCategories([]);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, view]);

  // Загрузка подкатегорий
  useEffect(() => {
    if (view === 'subcategories' && selectedCategory) {
      setLoading(true);
      setError(null);
      fetch(`http://localhost:3000/api/categories/${selectedCategory.id}/subcategories`)
        .then(res => {
          const contentType = res.headers.get('content-type');
          if (!res.ok) throw new Error('Не удалось загрузить подкатегории');
          if (!contentType || !contentType.includes('application/json')) throw new Error('Ошибка сервера: получен неожиданный ответ');
          return res.json();
        })
        .then(setSubcategories)
        .catch(err => {
          setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке подкатегорий');
          setSubcategories([]);
        })
        .finally(() => setLoading(false));
    }
  }, [view, selectedCategory]);

  // Сброс состояния при закрытии
  useEffect(() => {
    if (!isOpen) {
      setView('categories');
      setSelectedCategory(null);
      setSubcategories([]);
      setError(null);
    }
  }, [isOpen]);

  // Анимация свайпа
  const handleCategoryClick = (category: Category) => {
    setAnimating(true);
    setTimeout(() => {
      setSelectedCategory(category);
      setView('subcategories');
      setAnimating(false);
    }, 250); // длительность анимации
  };

  const handleBack = () => {
    setAnimating(true);
    setTimeout(() => {
      setView('categories');
      setSelectedCategory(null);
      setAnimating(false);
    }, 250);
  };

  // Карточки (категории/подкатегории)
  const renderCards = (items: {id: string, name: string}[], onClick: (id: string) => void) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {items.map((item) => (
        <Card
          key={item.id}
          isPressable
          onPress={() => onClick(item.id)}
          className="h-full"
        >
          <CardBody className="p-0">
            <img
              src={categoryImages[item.name as keyof typeof categoryImages] || categoryImages.default}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
          </CardBody>
          <CardFooter className="flex justify-center">
            <h3 className="text-lg font-semibold">{item.name}</h3>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose}
      placement="left"
      size="full"
    >
      <DrawerContent>
        <DrawerHeader className="flex justify-between items-center">
          {view === 'subcategories' ? (
            <Button variant="light" onPress={handleBack} className="mr-2">←</Button>
          ) : null}
          <h2 className="text-xl font-bold">
            {view === 'categories' ? 'Категории' : selectedCategory?.name || 'Подкатегории'}
          </h2>
          <Button 
            variant="light" 
            onPress={onClose}
            className="text-default-500"
          >
            Закрыть
          </Button>
        </DrawerHeader>
        
        <DrawerBody className="relative overflow-hidden">
          <div className="w-full h-full relative">
            {/* Анимированные экраны */}
            <div
              className={`absolute top-0 left-0 w-full h-full transition-transform duration-250 ${view === 'categories' && !animating ? 'translate-x-0' : '-translate-x-full'} ${animating && view === 'subcategories' ? '-translate-x-full' : ''}`}
              style={{ zIndex: view === 'categories' ? 2 : 1 }}
            >
              {loading && view === 'categories' ? (
                <div className="flex justify-center items-center h-full">
                  <p>Загрузка категорий...</p>
                </div>
              ) : error && view === 'categories' ? (
                <div className="flex justify-center items-center h-full text-danger">
                  <p>{error}</p>
                </div>
              ) : (
                renderCards(categories, (id) => {
                  const cat = categories.find(c => c.id === id);
                  if (cat) handleCategoryClick(cat);
                })
              )}
            </div>
            <div
              className={`absolute top-0 left-0 w-full h-full transition-transform duration-250 ${view === 'subcategories' && !animating ? 'translate-x-0' : 'translate-x-full'} ${animating && view === 'categories' ? 'translate-x-full' : ''}`}
              style={{ zIndex: view === 'subcategories' ? 2 : 1 }}
            >
              {loading && view === 'subcategories' ? (
                <div className="flex justify-center items-center h-full">
                  <p>Загрузка подкатегорий...</p>
                </div>
              ) : error && view === 'subcategories' ? (
                <div className="flex justify-center items-center h-full text-danger">
                  <p>{error}</p>
                </div>
              ) : (
                renderCards(subcategories, (id) => {
                  // Переход на страницу каталога товаров по подкатегории
                  navigate(`/catalog/${id}`);
                  onClose();
                })
              )}
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}; 