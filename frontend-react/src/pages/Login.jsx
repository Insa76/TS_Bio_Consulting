// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validación mínima
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      // El AuthContext ya maneja la redirección según rol
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5e9dc65', // Fondo beige claro
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0rem',
      borderRadius: '6px',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Contenedor del formulario */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(61, 56, 52, 1)',
        overflow: 'hidden'
      }}>
        {/* Encabezado */}
        <div style={{
          backgroundColor: '#D4B9A5', // Marrón cálido pastel
          color: '#7D6A5E',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            margin: '0',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            Inicia sesión
          </h2>
          <p style={{
            margin: '0.5rem 0 0',
            fontSize: '0.95rem',
            opacity: 0.9
          }}>
            Accede a tu panel de auditorías médicas con IA
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{
          padding: '2rem'
        }}>
          {error && (
            <div style={{
              backgroundColor: '#D9A39A',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Campo: Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.95rem',
              color: '#7D6A5E',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #E8D6C6',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#D4B9A5';
                e.target.style.boxShadow = '0 0 0 3px rgba(212, 185, 165, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E8D6C6';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Campo: Contraseña */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.95rem',
              color: '#7D6A5E',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #E8D6C6',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#D4B9A5';
                e.target.style.boxShadow = '0 0 0 3px rgba(212, 185, 165, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E8D6C6';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: loading ? '#B8A89D' : '#7D6A5E',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Pie de página */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #E8D6C6',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#B8A89D'
        }}>
          ¿No tienes una cuenta?{' '}
          <a
            href="/register"
            style={{
              color: '#D4B9A5',
              textDecoration: 'none',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.color = '#CAB09C'}
            onMouseOut={(e) => e.target.style.color = '#D4B9A5'}
          >
            Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;