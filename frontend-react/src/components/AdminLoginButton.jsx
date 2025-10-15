// src/components/AdminLoginButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginButton = () => {
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: 'tania@admin.com',
          password: '123456'
        })
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirige al dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error en login admin:", error);
      alert("No se pudo iniciar sesión como admin");
    }
  };

  return (
    <button
      onClick={handleAdminLogin}
      style={{
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#D4B9A5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'background-color 0.3s ease',
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#B8A89D'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#D4B9A5'}
    >
      👤 Login como Admin
    </button>
  );
};

export default AdminLoginButton;