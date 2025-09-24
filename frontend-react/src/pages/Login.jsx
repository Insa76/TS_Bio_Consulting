// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '80px auto',
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(125, 106, 94, 0.1)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: '600',
        color: '#7D6A5E',
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        Iniciar Sesión
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#7D6A5E',
            fontSize: '1rem'
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #E8D6C6',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#7D6A5E',
            fontSize: '1rem'
          }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #E8D6C6',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: '10px',
            backgroundColor: '#D9A39A',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#D4B9A5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          Iniciar Sesión
        </button>
        <Link to="/forgot-password" style={{ color: '#D4B9A5', fontSize: '0.9rem' }}>
        ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </div>
  );
};

export default Login;