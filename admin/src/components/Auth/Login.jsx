import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await login(data.username, data.password);
    } catch (err) {
      setError('Неверные учетные данные. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">Вход в админ-панель</h2>
          
          {error && (
            <div className="alert alert-error shadow-lg">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Имя пользователя</span>
              </label>
              <input 
                type="text" 
                placeholder="admin" 
                className={`input input-bordered ${errors.username ? 'input-error' : ''}`}
                {...register('username', { required: true })}
              />
              {errors.username && <span className="text-error mt-1">Имя пользователя обязательно</span>}
            </div>
            
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Пароль</span>
              </label>
              <input 
                type="password" 
                placeholder="******" 
                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                {...register('password', { required: true })}
              />
              {errors.password && <span className="text-error mt-1">Пароль обязателен</span>}
            </div>
            
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 