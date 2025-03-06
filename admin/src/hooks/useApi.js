import { useState, useCallback } from 'react';
import { 
  fetchEntities, 
  fetchEntityById, 
  createEntity, 
  updateEntity, 
  deleteEntity 
} from '../utils/api';

const useApi = (entityType) => {
  const [data, setData] = useState([]);
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchEntities(entityType, params);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Произошла ошибка при получении данных');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  const getById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchEntityById(entityType, id);
      setEntity(result);
      return result;
    } catch (err) {
      setError(err.message || `Ошибка при получении ${entityType} по ID`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  const create = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createEntity(entityType, data);
      setData(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.message || `Ошибка при создании ${entityType}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  const update = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateEntity(entityType, id, data);
      setData(prev => prev.map(item => item.id === id ? result : item));
      if (entity && entity.id === id) {
        setEntity(result);
      }
      return result;
    } catch (err) {
      setError(err.message || `Ошибка при обновлении ${entityType}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityType, entity]);

  const remove = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteEntity(entityType, id);
      setData(prev => prev.filter(item => item.id !== id));
      if (entity && entity.id === id) {
        setEntity(null);
      }
    } catch (err) {
      setError(err.message || `Ошибка при удалении ${entityType}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entityType, entity]);

  return {
    data,
    entity,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,
  };
};

export default useApi; 