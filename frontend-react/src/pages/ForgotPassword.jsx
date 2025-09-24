// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${encodeURIComponent(email)}`
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error al enviar el correo. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5E9DC',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(125, 106, 94, 0.15)',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#D4B9A5',
          color: '#7D6A5E',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0', fontSize: '1.5rem', fontWeight: '600' }}>
            Recuperar Contraseña
          </h2>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem', opacity: 0.9 }}>
            Ingresa tu email para recibir un enlace de recuperación.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {message ? (
            <div style={{
              padding: '1rem',
              backgroundColor: message.includes('recibirás') ? '#C5D7C5' : '#D9A39A',
              color: 'white',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {message}
            </div>
          ) : (
            <>
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
                    padding: '0.75rem 1rem',
                    border: '1px solid #E8D6C6',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>

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
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </>
          )}
        </form>

        <div style={{
          padding: '1rem',
          borderTop: '1px solid #E8D6C6',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#B8A89D'
        }}>
          <Link to="/login" style={{ color: '#D4B9A5', textDecoration: 'none' }}>
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;