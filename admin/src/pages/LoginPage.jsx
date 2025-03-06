import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from '../components/Auth/Login';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
};

export default LoginPage; 