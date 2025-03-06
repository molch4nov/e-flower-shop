import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EntityList from '../components/EntityManagement/EntityList';
import EntityForm from '../components/EntityManagement/EntityForm';

const EntityPage = () => {
  const { entityType } = useParams();
  const navigate = useNavigate();
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [mode, setMode] = useState(null); // 'create', 'edit', 'view'

  const handleSelect = (entity, actionMode) => {
    setSelectedEntity(entity);
    setMode(actionMode);
  };

  const handleAdd = () => {
    setSelectedEntity(null);
    setMode('create');
  };

  const handleCancel = () => {
    setSelectedEntity(null);
    setMode(null);
  };

  const handleSuccess = () => {
    setSelectedEntity(null);
    setMode(null);
  };

  const getTitle = () => {
    const entityTypeName = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    
    if (mode === 'create') {
      return `Добавление ${entityTypeName}`;
    } else if (mode === 'edit') {
      return `Редактирование ${entityTypeName}`;
    } else if (mode === 'view') {
      return `Просмотр ${entityTypeName}`;
    } else {
      return `Управление ${entityTypeName}`;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{getTitle()}</h1>
        {mode && (
          <button className="btn btn-outline" onClick={handleCancel}>
            Вернуться к списку
          </button>
        )}
      </div>

      {mode ? (
        <EntityForm
          entityType={entityType}
          entityId={selectedEntity ? selectedEntity.id || selectedEntity._id : null}
          mode={mode}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      ) : (
        <EntityList
          entityType={entityType}
          onSelect={handleSelect}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default EntityPage; 