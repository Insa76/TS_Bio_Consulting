// src/pages/TeamPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeamPanel = () => {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsRes = await fetch('http://localhost:8000/teams', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const membersRes = await fetch('http://localhost:8000/teams/members', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const tasksRes = await fetch('http://localhost:8000/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!teamsRes.ok || !membersRes.ok || !tasksRes.ok) throw new Error('Error al cargar los datos');

        const teamsData = await teamsRes.json();
        const membersData = await membersRes.json();
        const tasksData = await tasksRes.json();

        setTeams(teamsData);
        setMembers(membersData);
        setTasks(tasksData);

      } catch (err) {
        console.error("Error en carga:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Funciones CRUD para equipos
  const createTeam = async (name, description) => {
    try {
      const response = await fetch('http://localhost:8000/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, description })
      });

      if (!response.ok) throw new Error('Error al crear el equipo');

      const newTeam = await response.json();
      setTeams(prev => [...prev, newTeam]);
      alert("✅ Equipo creado con éxito");

    } catch (err) {
      console.error("Error al crear equipo:", err);
      alert("No se pudo crear el equipo");
    }
  };

  const updateTeam = async (id, name, description) => {
    try {
      const response = await fetch(`http://localhost:8000/teams/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, description })
      });

      if (!response.ok) throw new Error('Error al actualizar el equipo');

      const updatedTeam = await response.json();
      setTeams(prev => prev.map(t => t.id === id ? updatedTeam : t));
      alert("✅ Equipo actualizado con éxito");

    } catch (err) {
      console.error("Error al actualizar equipo:", err);
      alert("No se pudo actualizar el equipo");
    }
  };

  const deleteTeam = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este equipo?")) return;

    try {
      const response = await fetch(`http://localhost:8000/teams/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar el equipo');

      setTeams(prev => prev.filter(t => t.id !== id));
      alert("✅ Equipo eliminado con éxito");

    } catch (err) {
      console.error("Error al eliminar equipo:", err);
      alert("No se pudo eliminar el equipo");
    }
  };

  // Funciones CRUD para miembros
  const assignMemberToTeam = async (teamId, memberEmail) => {
    try {
      const response = await fetch(`http://localhost:8000/teams/${teamId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ member_email: memberEmail })
      });

      if (!response.ok) throw new Error('Error al asignar miembro');

      const result = await response.json();
      alert(result.message);

      // Recargar miembros
      const membersRes = await fetch('http://localhost:8000/teams/members', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const membersData = await membersRes.json();
      setMembers(membersData);

    } catch (err) {
      console.error("Error al asignar miembro:", err);
      alert("No se pudo asignar el miembro");
    }
  };

  const removeMemberFromTeam = async (memberId) => {
    try {
      const response = await fetch(`http://localhost:8000/users/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ team_id: null })
      });

      if (!response.ok) throw new Error('Error al quitar miembro del equipo');

      // Recargar miembros
      const membersRes = await fetch('http://localhost:8000/teams/members', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const membersData = await membersRes.json();
      setMembers(membersData);
      alert("✅ Miembro quitado del equipo");

    } catch (err) {
      console.error("Error al quitar miembro:", err);
      alert("No se pudo quitar el miembro");
    }
  };

  // Funciones CRUD para tareas
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Error al actualizar la tarea');

      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      alert(`✅ Tarea marcada como ${newStatus}`);

    } catch (err) {
      console.error("Error al actualizar tarea:", err);
      alert("No se pudo actualizar la tarea");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta tarea?")) return;

    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar la tarea');

      setTasks(prev => prev.filter(t => t.id !== taskId));
      alert("✅ Tarea eliminada con éxito");

    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      alert("No se pudo eliminar la tarea");
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
        <p style={{ color: '#7D6A5E', marginTop: '12px' }}>Cargando equipos, miembros y tareas...</p>
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
        👥 Panel de Equipo
      </h1>

      <p style={{
        color: '#B8A89D',
        marginBottom: '32px'
      }}>
        Gestiona equipos, miembros y tareas.
      </p>

      {/* Botón para crear nuevo equipo */}
      <button
        onClick={() => navigate('/create-team')}
        style={{
          padding: '12px 24px',
          backgroundColor: '#D4B9A5',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
      >
        + Crear Nuevo Equipo
      </button>

      {/* Sección: Equipos */}
      <div style={{
        backgroundColor: '#F5E9DC',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '32px',
        marginTop: '20px'
      }}>
        <h2 style={{ color: '#7D6A5E', marginBottom: '16px' }}>Equipos</h2>
        {teams.length === 0 ? (
          <p>No hay equipos creados.</p>
        ) : (
          <ul style={{
            listStyle: 'none',
            padding: 0
          }}>
            {teams.map((team) => (
              <li key={team.id} style={{
                padding: '12px',
                backgroundColor: '#FFF',
                borderRadius: '6px',
                marginBottom: '8px',
                borderLeft: '4px solid #D4B9A5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{team.name}</strong>
                  <p style={{ color: '#666', marginTop: '4px' }}>{team.description || 'Sin descripción'}</p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      const newName = prompt("Nuevo nombre:", team.name);
                      const newDescription = prompt("Nueva descripción:", team.description);
                      if (newName && newDescription) {
                        updateTeam(team.id, newName, newDescription);
                      }
                    }}
                    style={{
                      marginRight: '8px',
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
                    onClick={() => deleteTeam(team.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#B8A89D',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sección: Miembros */}
      <div style={{
        backgroundColor: '#F5E9DC',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '32px'
      }}>
        <h2 style={{ color: '#7D6A5E', marginBottom: '16px' }}>Miembros del equipo</h2>
        {members.length === 0 ? (
          <p>No hay miembros asignados a equipos.</p>
        ) : (
          <ul style={{
            listStyle: 'none',
            padding: 0
          }}>
            {members.map((member) => (
              <li key={member.id} style={{
                padding: '12px',
                backgroundColor: '#FFF',
                borderRadius: '6px',
                marginBottom: '8px',
                borderLeft: '4px solid #D4B9A5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{member.name}</strong> - {member.email}
                  <p style={{ color: '#666', marginTop: '4px' }}>
                    Rol: {member.role} | Equipo: {member.team_id || 'Sin equipo'}
                  </p>
                </div>
                <div>
                  {member.team_id ? (
                    <button
                      onClick={() => removeMemberFromTeam(member.id)}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#B8A89D',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      🚫 Quitar de equipo
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const teamId = prompt("ID del equipo:");
                        if (teamId) {
                          assignMemberToTeam(teamId, member.email);
                        }
                      }}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#7D6A5E',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      📌 Asignar a equipo
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/tasks?responsible=${member.email}`)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#7D6A5E',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    📋 Ver tareas
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sección: Tareas del equipo */}
      <div style={{
        backgroundColor: '#F5E9DC',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '32px'
      }}>
        <h2 style={{ color: '#7D6A5E', marginBottom: '16px' }}>📋 Tareas del Equipo</h2>
        {tasks.length === 0 ? (
          <p>No hay tareas asignadas.</p>
        ) : (
          <ul style={{
            listStyle: 'none',
            padding: 0
          }}>
            {tasks.map((task) => (
              <li key={task.id} style={{
                padding: '12px',
                backgroundColor: '#FFF',
                borderRadius: '6px',
                marginBottom: '8px',
                borderLeft: '4px solid #D4B9A5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{task.action}</strong>
                  <p style={{ color: '#666', marginTop: '4px' }}>
                    Responsable: {task.responsible} | Vence: {new Date(task.deadline).toLocaleDateString()}
                  </p>
                  <p style={{ color: task.status === 'Completada' ? '#4CAF50' : '#FF9800', fontWeight: '500' }}>
                    Estado: {task.status}
                  </p>
                </div>
                <div>
                  {task.status === 'Pendiente' ? (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'Completada')}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      ✅ Completar
                    </button>
                  ) : (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'Pendiente')}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#FF9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      🔄 Reabrir
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#B8A89D',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
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

export default TeamPanel;