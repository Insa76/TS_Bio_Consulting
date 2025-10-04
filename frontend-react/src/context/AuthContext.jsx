// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.warn("No se pudo cargar el usuario desde localStorage");
      }
    }
    setLoading(false);
  }, []);

  // Iniciar sesión
  const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: email,
        password: password
      })
    });

    // Si el fetch falló (red, 404, 500, etc.)
    if (!response.ok) {
      const errorText = await response.text(); // A veces no es JSON
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);

  } catch (error) {
    console.error("Error en login:", error);
    throw error; // Para que el frontend lo muestre
  }
};

  // Registro de usuario
  const register = async (name, email, password, organization) => {
    const response = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        name,
        email,
        password,
        organization
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error al registrar');
    }

    const data = await response.json();

    const userData = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      organization: data.user.organization
    };

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};