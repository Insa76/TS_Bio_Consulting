// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage("Token no válido. Por favor, revisa el enlace.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `token=${encodeURIComponent(token)}&new_password=${encodeURIComponent(newPassword)}`
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      setMessage("Error al restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#D9A39A' }}>
        <h2>Error</h2>
        <p>{message}</p>
      </div>
    );
  }

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
            Nueva Contraseña
          </h2>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem', opacity: 0.9 }}>
            Establece una nueva contraseña segura.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {message ? (
            <div style={{
              padding: '1rem',
              backgroundColor: message.includes('éxito') ? '#C5D7C5' : '#D9A39A',
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
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  color: '#7D6A5E',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;