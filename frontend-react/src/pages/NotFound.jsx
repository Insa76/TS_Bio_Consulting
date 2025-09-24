import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
      <p className="text-gray-500 mb-8">La página que busca no existe o ha sido movida.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;