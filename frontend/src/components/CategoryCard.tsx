import { Card, CardBody, CardFooter } from "@heroui/react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    files?: { id: string; filename: string }[];
  };
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  // Изображение категории (по умолчанию или первое из файлов)
  const imageUrl = category.files && category.files.length > 0
    ? `/api/files/${category.files[0].id}`
    : "https://via.placeholder.com/300x200?text=Категория";

  return (
    <Card 
      as={Link} 
      to={`/catalog?category=${category.id}`}
      isPressable
      className="overflow-hidden h-full hover:shadow-md transition-shadow"
    >
      <CardBody className="p-0 overflow-hidden">
        <div className="relative h-40">
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      </CardBody>
      <CardFooter className="absolute bottom-0 z-10 p-4 w-full">
        <h3 className="font-semibold text-lg text-white">{category.name}</h3>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard; 