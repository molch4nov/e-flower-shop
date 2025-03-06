import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import useApi from '../../hooks/useApi';

const EntityList = ({ entityType, onSelect, onAdd }) => {
  const { data, loading, error, getAll, remove } = useApi(entityType);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const pageSize = 10;

  useEffect(() => {
    getAll();
  }, [getAll]);

  const filteredData = data.filter(item => 
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await remove(id);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  if (loading && !data.length) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Ошибка: {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-box shadow-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <div className="form-control">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Поиск..." 
              className="input input-bordered" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn btn-square">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          <FiPlus className="mr-2" /> Добавить
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              {data.length > 0 && 
                Object.keys(data[0])
                  .filter(key => key !== 'id' && key !== '_id' && !key.startsWith('_'))
                  .slice(0, 3)
                  .map(key => <th key={key}>{key}</th>)
              }
              <th className="text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">Нет данных для отображения</td>
              </tr>
            ) : (
              paginatedData.map(item => (
                <tr key={item.id || item._id}>
                  <td>{item.id || item._id}</td>
                  {Object.keys(item)
                    .filter(key => key !== 'id' && key !== '_id' && !key.startsWith('_'))
                    .slice(0, 3)
                    .map(key => (
                      <td key={key}>
                        {typeof item[key] === 'boolean' 
                          ? item[key] ? 'Да' : 'Нет'
                          : String(item[key]).length > 30 
                            ? `${String(item[key]).slice(0, 30)}...` 
                            : item[key]}
                      </td>
                    ))
                  }
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="btn btn-circle btn-sm btn-ghost"
                        onClick={() => onSelect(item, 'view')}
                      >
                        <FiEye className="text-info" />
                      </button>
                      <button 
                        className="btn btn-circle btn-sm btn-ghost"
                        onClick={() => onSelect(item, 'edit')}
                      >
                        <FiEdit className="text-warning" />
                      </button>
                      <button 
                        className="btn btn-circle btn-sm btn-ghost"
                        onClick={() => confirmDelete(item)}
                      >
                        <FiTrash2 className="text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="join">
            <button 
              className="join-item btn"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i}
                className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="join-item btn"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-box max-w-md w-full">
            <h3 className="font-bold text-lg mb-4">Подтвердите удаление</h3>
            <p>Вы уверены, что хотите удалить этот элемент?</p>
            <p className="font-semibold my-2">ID: {itemToDelete.id || itemToDelete._id}</p>
            <div className="modal-action">
              <button className="btn" onClick={cancelDelete}>Отмена</button>
              <button 
                className={`btn btn-error ${isDeleting ? 'loading' : ''}`}
                onClick={() => handleDelete(itemToDelete.id || itemToDelete._id)}
                disabled={isDeleting}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityList; 