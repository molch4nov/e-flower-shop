import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { filesApi, productsApi } from '../../services/api';

export default function FileUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [parentId, setParentId] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Ошибка при загрузке товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !parentId) {
      toast.error('Выберите файл и родительский товар');
      return;
    }
    
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('parent_id', parentId);
      
      await filesApi.upload(formData);
      toast.success('Файл успешно загружен');
      navigate('/files');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Ошибка при загрузке файла');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Загрузка файла</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              Файл
            </label>
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Загрузить файл</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">или перетащите его сюда</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF до 10MB
                </p>
              </div>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-500">
                Выбран файл: {file.name}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">
              Связать с товаром
            </label>
            <select
              id="parent_id"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Выберите товар</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/files')}
              disabled={uploading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Загрузка...
                </span>
              ) : (
                'Загрузить'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 