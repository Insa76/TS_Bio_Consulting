// src/pages/TeamManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const navigate = useNavigate();
  const { user } = useAuth();

  // Cargar equipos
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:8000/teams', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Error al cargar equipos');

        const data = await response.json();
        setTeams(data);
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los equipos');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Crear equipo
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newTeam)
      });

      if (!response.ok) throw new Error('Error al crear el equipo');

      const data = await response.json();
      setTeams([...teams, data]);
      setNewTeam({ name: '', description: '' });
      alert("✅ Equipo creado con éxito");
    } catch (err) {
      setError(err.message || 'No se pudo crear el equipo');
    }
  };

  // Editar equipo
  const handleUpdateTeam = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/teams/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error('Error al actualizar el equipo');

      const data = await response.json();
      setTeams(teams.map(t => t.id === id ? data : t));
      alert("✅ Equipo actualizado con éxito");
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el equipo');
    }
  };

  // Eliminar equipo
  const handleDeleteTeam = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este equipo?")) return;

    try {
      const response = await fetch(`http://localhost:8000/teams/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar el equipo');

      setTeams(teams.filter(t => t.id !== id));
      alert("✅ Equipo eliminado con éxito");
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el equipo');
    }
  };

  // Asignar miembro a equipo
  const handleAssignMember = async (teamId, email) => {
    try {
      const response = await fetch(`http://localhost:8000/teams/${teamId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ member_email: email })
      });

      if (!response.ok) throw new Error('Error al asignar miembro');

      const data = await response.json();
      alert(data.message);
    } catch (err) {
      setError(err.message || 'No se pudo asignar el miembro');
    }
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{
          display: 'inline-block',
          width: '32px',
          height: '32px',
          border: '4px solid #D4B9A5',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#7D6A5E', marginTop: '12px' }}>Cargando equipos...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#D9A39A',
        color: 'white',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1000px',
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
        👥 Gestión de Equipos
      </h1>

      <p style={{
        color: '#B8A89D',
        marginBottom: '32px'
      }}>
        Crea, edita y elimina equipos. Asigna miembros y gestiona tareas.
      </p>

      {/* Formulario para crear equipo */}
      <div style={{
        backgroundColor: '#F5E9DC',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '32px'
      }}>
        <h2 style={{ color: '#7D6A5E', marginBottom: '16px' }}>➕ Crear Nuevo Equipo</h2>
        <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.95rem', color: '#7D6A5E', marginBottom: '4px' }}>
              Nombre del equipo
            </label>
            <input
              type="text"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #E8D6C6',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
              onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.95rem', color: '#7D6A5E', marginBottom: '4px' }}>
              Descripción (opcional)
            </label>
            <textarea
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #E8D6C6',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
              onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#D4B9A5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Crear Equipo
          </button>
        </form>
      </div>

      {/* Lista de equipos */}
      <div style={{
        backgroundColor: '#F5E9DC',
        padding: '24px',
        borderRadius: '8px'
      }}>
        <h2 style={{ color: '#7D6A5E', marginBottom: '16px' }}>📋 Equipos Existentes</h2>
        {teams.length === 0 ? (
          <p style={{ color: '#B8A89D' }}>No hay equipos creados aún.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {teams.map((team) => (
              <div key={team.id} style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(125, 106, 94, 0.1)',
                borderLeft: '4px solid #D4B9A5'
              }}>
                <h3 style={{ color: '#7D6A5E', marginBottom: '8px' }}>{team.name}</h3>
                <p style={{ color: '#B8A89D', marginBottom: '16px' }}>{team.description || 'Sin descripción'}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      const newName = prompt("Nuevo nombre:", team.name);
                      const newDesc = prompt("Nueva descripción:", team.description);
                      if (newName && newDesc) {
                        handleUpdateTeam(team.id, { name: newName, description: newDesc });
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#7D6A5E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#D9A39A',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                  <button
                    onClick={() => {
                      const email = prompt("Email del miembro a asignar:");
                      if (email) {
                        handleAssignMember(team.id, email);
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    📌 Asignar miembro
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/dashboard')}
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

export default TeamManagement;