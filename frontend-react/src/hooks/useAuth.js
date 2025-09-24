// src/hook/useAuth.js

import { useState, useEffect } from 'react';
import { getToken, isAuthenticated } from '../service/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      // Aquí podrías hacer un GET /me para cargar datos del usuario
      // Por ahora, solo asumimos que si hay token, el usuario está logueado
      setUser({ id: 1, email: 'usuario@ejemplo.com' }); // Simulación
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
      if (!data.ok) throw new Error('Login fallido');
      const tokenData = await data.json();
      localStorage.setItem('token', tokenData.access_token);
      setUser({ id: 1, email }); // Simulación
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
  };
};