import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useApi from '../../hooks/useApi';

const EntityForm = ({ entityType, entityId, mode, onCancel, onSuccess }) => {
  const { entity, getById, create, update, loading } = useApi(entityType);
  const [formFields, setFormFields] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntity = async () => {
      if (mode !== 'create' && entityId) {
        try {
          await getById(entityId);
        } catch (error) {
          setError('Не удалось загрузить данные');
        }
      }
    };

    fetchEntity();
  }, [entityId, mode, getById]);

  useEffect(() => {
    if (entity && (mode === 'edit' || mode === 'view')) {
      reset(entity);
      
      // Определяем поля формы на основе полученной сущности
      const fields = Object.keys(entity)
        .filter(key => !key.startsWith('_') && key !== 'id' && key !== '_id')
        .map(key => {
          let fieldType = 'text';
          
          if (typeof entity[key] === 'boolean') {
            fieldType = 'checkbox';
          } else if (typeof entity[key] === 'number') {
            fieldType = 'number';
          } else if (entity[key] instanceof Date) {
            fieldType = 'datetime-local';
          } else if (typeof entity[key] === 'object' && entity[key] !== null) {
            fieldType = 'json';
          }
          
          return {
            name: key,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            type: fieldType,
            value: entity[key],
            required: key !== 'description' && key !== 'notes'
          };
        });
      
      setFormFields(fields);
    } else if (mode === 'create') {
      // Для создания используем шаблон полей или пустую форму
      // В реальном приложении можно запросить метаданные с сервера
      setFormFields([
        { name: 'name', label: 'Название', type: 'text', required: true },
        { name: 'description', label: 'Описание', type: 'textarea', required: false }
      ]);
      reset({});
    }
  }, [entity, mode, reset]);

  const onSubmit = async (data) => {
    try {
      setError(null);
      if (mode === 'create') {
        await create(data);
      } else if (mode === 'edit') {
        await update(entityId, data);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Произошла ошибка при сохранении');
    }
  };

  if (loading && !entity && mode !== 'create') {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-box shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {mode === 'create' ? 'Создать' : mode === 'edit' ? 'Редактировать' : 'Просмотр'} {entityType}
      </h2>
      
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map(field => (
            <div key={field.name} className={field.type === 'textarea' || field.type === 'json' ? 'col-span-full' : ''}>
              <label className="label">
                <span className="label-text">{field.label}</span>
                {field.required && <span className="text-error">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  className={`textarea textarea-bordered w-full ${errors[field.name] ? 'textarea-error' : ''}`}
                  placeholder={field.label}
                  {...register(field.name, { required: field.required })}
                  disabled={mode === 'view'}
                  rows={4}
                />
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  className={`toggle ${errors[field.name] ? 'toggle-error' : 'toggle-primary'}`}
                  {...register(field.name)}
                  disabled={mode === 'view'}
                />
              ) : field.type === 'json' ? (
                <textarea
                  className={`textarea textarea-bordered w-full font-mono ${errors[field.name] ? 'textarea-error' : ''}`}
                  placeholder={field.label}
                  {...register(field.name, { 
                    required: field.required,
                    validate: value => {
                      try {
                        if (!value) return true;
                        JSON.parse(value);
                        return true;
                      } catch (e) {
                        return 'Неверный формат JSON';
                      }
                    }
                  })}
                  disabled={mode === 'view'}
                  rows={8}
                  defaultValue={field.value ? JSON.stringify(field.value, null, 2) : ''}
                />
              ) : (
                <input
                  type={field.type}
                  className={`input input-bordered w-full ${errors[field.name] ? 'input-error' : ''}`}
                  placeholder={field.label}
                  {...register(field.name, { required: field.required })}
                  disabled={mode === 'view'}
                />
              )}
              
              {errors[field.name] && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors[field.name].message || 'Это поле обязательно'}
                  </span>
                </label>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-2 mt-8">
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={onCancel}
          >
            {mode === 'view' ? 'Закрыть' : 'Отмена'}
          </button>
          
          {mode !== 'view' && (
            <button 
              type="submit" 
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {mode === 'create' ? 'Создать' : 'Сохранить'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EntityForm; 