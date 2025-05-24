import React, { useState, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, Input } from "@heroui/react";
import { useAuth } from "../providers/AuthProvider";
import api from "@/config/api";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ isOpen, onClose, productId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Обработка выбора файлов
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = [...Array.from(e.target.files || [])];
    if (!fileList) return;
    
    // Проверяем количество выбранных файлов (не больше 5)
    if (photos.length + fileList.length > 5) {
      setError("Максимальное количество фотографий - 5");
      return;
    }
    
    // Проверяем размер и тип файлов
    const validFiles: any[] = [];
    const validPreviews: string[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setError("Можно загружать только изображения");
        continue;
      }
      
      // Проверка размера файла (максимум 5 МБ)
      if (file.size > 5 * 1024 * 1024) {
        setError("Размер файла не должен превышать 5 МБ");
        continue;
      }
      
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }
    
    // Добавляем новые файлы к существующим
    setPhotos(prev => [...prev, ...validFiles]);
    setPhotosPreviews(prev => [...prev, ...validPreviews]);
  };

  // Обработка удаления файла
  const handleRemoveFile = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    
    // Освобождаем URL объекта
    URL.revokeObjectURL(photosPreviews[index]);
    setPhotosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Очистка формы
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRating(5);
    setError(null);
    
    // Освобождаем URL объектов
    photosPreviews.forEach(url => URL.revokeObjectURL(url));
    setPhotos([]);
    setPhotosPreviews([]);
  };

  // Обработка закрытия модального окна
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Обработка отправки формы
  const handleSubmit = async () => {
    if (!user) {
      setError("Необходимо авторизоваться для добавления отзыва");
      return;
    }
    
    if (!title.trim() || !description.trim()) {
      setError("Заполните все поля формы");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Сначала создаем отзыв
      const reviewData = await api.post("/reviews", {
        title,
        description,
        rating,
        parent_id: productId
      });
      
      // Если есть фотографии, загружаем их
      if (photos.length > 0) {
        for (const photo of photos) {
          try {
            const formData = new FormData();
            formData.append("file", photo);
            formData.append("parent_id", reviewData.id);
            
            await api.upload("/files", formData);
          } catch (error) {
            console.error("Ошибка при отправке файла:", error);
          }
        }
      }
      
      // Сбрасываем форму
      resetForm();
      
      // Закрываем модальное окно и уведомляем о успехе
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка при добавлении отзыва");
      console.error("Ошибка при добавлении отзыва:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Оставить отзыв
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-sm font-medium mb-2">
                Оценка
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl focus:outline-none ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Заголовок
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Кратко о впечатлениях"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Отзыв
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Подробно опишите свои впечатления о товаре"
                rows={4}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Фотографии (не более 5)
              </label>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {photosPreviews.map((url, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={url} 
                      alt={`Фото ${index + 1}`} 
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() => handleRemoveFile(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {photos.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 border-2 border-dashed border-default-300 rounded flex items-center justify-center text-default-400"
                  >
                    +
                  </button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              
              <p className="text-xs text-default-500">
                Допустимые форматы: JPG, PNG, GIF. Максимальный размер: 5 МБ.
              </p>
            </div>
            
            {error && (
              <div className="mb-4 text-danger text-center">
                {error}
              </div>
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="light" 
            onPress={handleClose}
          >
            Отмена
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={loading}
          >
            Отправить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 