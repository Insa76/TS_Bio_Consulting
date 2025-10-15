// src/pages/AssignMembers.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AssignMembers = () => {
  const [formData, setFormData] = useState({
    teamId: '',
    memberEmail: ''
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
      const response = await fetch(`http://localhost:8000/teams/${formData.teamId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-jwt-token-123',
        },
        body: JSON.stringify({ member_email: formData.memberEmail })
      });

      if (!response.ok) throw new Error('Error al asignar miembro');

      alert("✅ Miembro asignado con éxito");
      navigate('/team'); // Redirige al panel de equipos

    } catch (err) {
      console.error("Error al asignar miembro:", err);
      setError(err.message || 'No se pudo asignar el miembro');
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
        <img src="/images/team2.png" width="50px" height="50px" /> Asignar Miembro a Equipo
      </h1>

      <p style={{
        color: '#B8A89D',
        marginBottom: '32px'
      }}>
        Asigna un miembro a un equipo existente.
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
            ID del equipo
          </label>
          <input
            type="number"
            name="teamId"
            value={formData.teamId}
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
            Email del miembro
          </label>
          <input
            type="email"
            name="memberEmail"
            value={formData.memberEmail}
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
          {loading ? 'Asignando miembro...' : 'Asignar Miembro'}
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

export default AssignMembers;