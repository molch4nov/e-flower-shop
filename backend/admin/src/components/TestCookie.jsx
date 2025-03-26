import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const TestCookie = () => {
  const [result, setResult] = useState('');
  
  const testCookie = async () => {
    try {
      const response = await axios.get('/api/auth/test-cookie', { 
        withCredentials: true 
      });
      console.log('Test cookie response:', response.data);
      console.log('Document cookies:', document.cookie);
      
      // Check all cookies
      const allCookies = Cookies.get();
      console.log('All cookies via js-cookie:', allCookies);
      
      setResult(`Response: ${JSON.stringify(response.data)}\n\nCookies: ${document.cookie}\n\njs-cookie: ${JSON.stringify(allCookies)}`);
    } catch (error) {
      console.error('Test cookie error:', error);
      setResult(`Error: ${error.message}`);
    }
  };
  
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Тест Cookie</h1>
      <button 
        onClick={testCookie}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Получить тестовую куку
      </button>
      
      {result && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 whitespace-pre-wrap">
          {result}
        </pre>
      )}
      
      <div className="mt-4">
        <h2 className="font-bold">Текущие cookies:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40 whitespace-pre-wrap">
          {document.cookie || 'Нет cookies'}
        </pre>
      </div>
    </div>
  );
};

export default TestCookie; 