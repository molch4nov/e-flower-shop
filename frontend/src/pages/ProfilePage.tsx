import { useAuth } from "../providers/AuthProvider";
import { FormEvent, useState } from "react";

const ProfilePage = () => {
  const { user, holidays, addresses, getCurrentUser, logout } = useAuth();
  
  // Состояние для редактирования профиля
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    birth_date: user?.birth_date || "",
  });

  // Обработчик изменения полей ввода
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Здесь будет запрос на обновление данных пользователя
      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Ошибка при обновлении профиля");
      }
      
      // Обновляем данные пользователя
      await getCurrentUser();
      
      // Выходим из режима редактирования
      setIsEditMode(false);
    } catch (err) {
      console.error("Ошибка при обновлении профиля:", err);
    }
  };

  // Обработчик выхода из аккаунта
  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return <div>Загрузка данных пользователя...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Личный кабинет</h1>
      
      <div className="profile-card">
        <h2>Мой профиль</h2>
        
        {!isEditMode ? (
          <>
            <div className="profile-info">
              <p><strong>Имя:</strong> {user.name}</p>
              <p><strong>Телефон:</strong> {user.phone_number}</p>
              <p><strong>Дата рождения:</strong> {user.birth_date || "Не указана"}</p>
            </div>
            
            <button onClick={() => setIsEditMode(true)}>
              Редактировать профиль
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="birth_date">Дата рождения</label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-actions">
              <button type="submit">Сохранить</button>
              <button 
                type="button" 
                onClick={() => setIsEditMode(false)}
                className="cancel-button"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="addresses-card">
        <h2>Мои адреса</h2>
        {addresses.length > 0 ? (
          <ul className="addresses-list">
            {addresses.map((address) => (
              <li key={address.id} className="address-item">
                <div className="address-title">{address.title}</div>
                <div className="address-text">{address.address}</div>
                {address.entrance && <div>Подъезд: {address.entrance}</div>}
                {address.floor && <div>Этаж: {address.floor}</div>}
                {address.apartment && <div>Квартира: {address.apartment}</div>}
                {address.notes && <div>Примечания: {address.notes}</div>}
              </li>
            ))}
          </ul>
        ) : (
          <p>У вас пока нет сохраненных адресов</p>
        )}
        
        <button className="add-button">Добавить новый адрес</button>
      </div>
      
      <div className="holidays-card">
        <h2>Мои праздники</h2>
        {holidays.length > 0 ? (
          <ul className="holidays-list">
            {holidays.map((holiday) => (
              <li key={holiday.id} className="holiday-item">
                <div className="holiday-name">{holiday.name}</div>
                <div className="holiday-date">
                  {new Date(holiday.date).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>У вас пока нет сохраненных праздников</p>
        )}
        
        <button className="add-button">Добавить праздник</button>
      </div>
      
      <div className="logout-section">
        <button onClick={handleLogout} className="logout-button">
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default ProfilePage; 