// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, organization);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al registrar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      //backgroundColor: '#7d6a5ea2', // Fondo beige claro
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Contenedor del formulario */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(125, 106, 94, 0.15)',
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
            Crea tu cuenta
          </h2>
          <p style={{
            margin: '0.5rem 0 0',
            fontSize: '0.95rem',
            opacity: 0.9
          }}>
            Únete a TS Bio Consulting y comienza tu evaluación sanitaria
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{
          padding: '2rem'
        }}>
          {error && (
            <div style={{
              backgroundColor: '#d9a49a',
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

          {/* Campo: Nombre */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.95rem',
              color: '#7D6A5E',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #E8D6C6',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
              onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
            />
          </div>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #E8D6C6',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
              onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #E8D6C6',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
              onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
            />
          </div>

          {/* Campo: Organización */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.95rem',
              color: '#7D6A5E',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              Nombre de la clínica u organización
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #E8D6C6',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
              onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
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
            {loading ? 'Registrando...' : 'Crear cuenta'}
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
          ¿Ya tienes una cuenta?{' '}
          <a
            href="/login"
            style={{
              color: '#D4B9A5',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Inicia sesión
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;