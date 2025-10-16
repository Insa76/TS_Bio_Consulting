// src/pages/CreateTeam.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CreateTeam = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-jwt-token-123',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al crear el equipo');

      alert("✅ Equipo creado con éxito");
      navigate('/team'); // Redirige al panel de equipos

    } catch (err) {
      console.error("Error al crear equipo:", err);
      setError(err.message || 'No se pudo crear el equipo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '40px auto',
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(125, 106, 94, 0.1)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#7D6A5E',
        marginBottom: '16px'
      }}>
        👥 Crear Nuevo Equipo
      </h1>

      <p style={{
        color: '#B8A89D',
        marginBottom: '32px'
      }}>
        Crea un nuevo equipo para asignar tareas y gestionar miembros.
      </p>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#D9A39A',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          marginBottom: '16px'
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            color: '#7D6A5E',
            marginBottom: '4px'
          }}>
            Nombre del equipo
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #E8D6C6'
            }}
          />
        </div>

        <div style={{
          marginBottom: '16px'
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            color: '#7D6A5E',
            marginBottom: '4px'
          }}>
            Descripción (opcional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #E8D6C6',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#B8A89D' : '#D4B9A5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          {loading ? 'Creando equipo...' : 'Crear Equipo'}
        </button>
      </form>

      <button
        onClick={() => navigate('/team')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#B8A89D',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer'
        }}
      >
        ← Volver al Panel
      </button>
    </div>
  );
};

export default CreateTeam;