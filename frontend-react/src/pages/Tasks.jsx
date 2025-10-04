// src/pages/Tasks.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // '' = todas, 'Pendiente', 'Completada'
  const [filterResponsible, setFilterResponsible] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  // Cargar tareas desde el backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8000/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Error al cargar las tareas');

        const data = await response.json();
        setTasks(data);

      } catch (err) {
        setError(err.message || 'No se pudieron cargar las tareas');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filtrar tareas
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesResponsible = !filterResponsible || task.responsible.toLowerCase().includes(filterResponsible.toLowerCase());
    return matchesStatus && matchesResponsible;
  });

  // Calcular estadísticas
  const total = filteredTasks.length;
  const completed = filteredTasks.filter(t => t.status === 'Completada').length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Actualizar estado de tarea
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

    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      alert("No se pudo actualizar la tarea. Revisa los datos.");
    }
  };

  // Eliminar tarea
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

    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      alert("No se pudo eliminar la tarea.");
    }
  };

  const sendEmailNotifications = async () => {
  try {
    const response = await fetch('http://localhost:8000/tasks/send-notifications', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) throw new Error('Error al enviar notificaciones');

    alert("✅ Notificaciones enviadas por email");
  } catch (error) {
    console.error("Error al enviar notificaciones:", error);
    alert("No se pudieron enviar las notificaciones.");
  }
};

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "32px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(125, 106, 94, 0.1)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#7D6A5E",
          marginBottom: "16px",
        }}
      >
        <img
          src="/images/doc2.png"
          alt="Bar principal"
          //className="w-sm h-sm object-cover object-center bg-black" 
          width="100px"
          height= "100px"
        /> Panel de Tareas
      </h1>

      <p
        style={{
          color: "#B8A89D",
          marginBottom: "32px",
        }}
      >
        Gestiona las tareas derivadas de tus auditorías.
      </p>

      {/* Estadísticas */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "24px",
          padding: "16px",
          backgroundColor: "#F5E9DC",
          borderRadius: "8px",
        }}
      >
        <div style={{ flex: 1, textAlign: "center" }}>
          <strong style={{ color: "#7D6A5E" }}>Total</strong>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#7D6A5E" }}
          >
            {total}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <strong style={{ color: "#4CAF50" }}>Completadas</strong>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#4CAF50" }}
          >
            {completed}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <strong style={{ color: "#FF9800" }}>Pendientes</strong>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FF9800" }}
          >
            {pending}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <strong style={{ color: "#1A3A7D" }}>Avance</strong>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1A3A7D" }}
          >
            {completionRate}%
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          padding: "16px",
          backgroundColor: "#F5E9DC",
          borderRadius: "8px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.9rem",
              color: "#7D6A5E",
              marginBottom: "4px",
            }}
          >
            Estado
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #E8D6C6",
            }}
          >
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Completada">Completada</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.9rem",
              color: "#7D6A5E",
              marginBottom: "4px",
            }}
          >
            Responsable
          </label>
          <input
            type="text"
            value={filterResponsible}
            onChange={(e) => setFilterResponsible(e.target.value)}
            placeholder="Buscar por nombre..."
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #E8D6C6",
            }}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#D9A39A",
            color: "white",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div
            style={{
              display: "inline-block",
              width: "32px",
              height: "32px",
              border: "4px solid #D4B9A5",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p style={{ color: "#7D6A5E", marginTop: "12px" }}>
            Cargando tareas...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#B8A89D",
            border: "2px dashed #E8D6C6",
            borderRadius: "8px",
          }}
        >
          <p>No hay tareas que coincidan con los filtros.</p>
          <button
            onClick={() => {
              setFilterStatus("");
              setFilterResponsible("");
            }}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#D4B9A5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Mostrar todas
          </button>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#F5E9DC",
                  color: "#7D6A5E",
                }}
              >
                <th style={tableHeaderStyle}>Acción</th>
                <th style={tableHeaderStyle}>Responsable</th>
                <th style={tableHeaderStyle}>Plazo</th>
                <th style={tableHeaderStyle}>Estado</th>
                <th style={tableHeaderStyle}>Indicador de éxito</th>
                <th style={tableHeaderStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} style={tableRowStyle}>
                  <td style={tableCellStyle}>{task.action}</td>
                  <td style={tableCellStyle}>{task.responsible}</td>
                  <td style={tableCellStyle}>
                    {new Date(task.deadline).toLocaleDateString()}
                  </td>
                  <td style={tableCellStyle}>
                    <span
                      style={{
                        color:
                          task.status === "Completada" ? "#4CAF50" : "#FF9800",
                        fontWeight: "500",
                      }}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{task.success_indicator}</td>
                  <td style={tableCellStyle}>
                    {task.status === "Pendiente" ? (
                      <button
                        onClick={() => updateTaskStatus(task.id, "Completada")}
                        style={{ ...actionButton, marginRight: "8px" }}
                      >
                        ✅ Completar
                      </button>
                    ) : (
                      <button
                        onClick={() => updateTaskStatus(task.id, "Pendiente")}
                        style={{
                          ...actionButton,
                          marginRight: "8px",
                          backgroundColor: "#FF9800",
                        }}
                      >
                        🔄 Reabrir
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{ ...actionButton, backgroundColor: "#B8A89D" }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={sendEmailNotifications}
        style={{
          padding: "8px 16px",
          backgroundColor: "#D4B9A5",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "0.9rem",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        Enviar notificaciones por email
      </button>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "20px",
          marginLeft: "20px",
          padding: "10px 20px",
          backgroundColor: "#B8A89D",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "500",
          cursor: "pointer",
        }}
      >
        ← Volver al Panel
      </button>
    </div>
  );
};

// Estilos reutilizables
const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #E8D6C6',
  backgroundColor: '#F5E9DC',
  color: '#7D6A5E'
};

const tableRowStyle = {
  borderBottom: '1px solid #E8D6C6',
  transition: 'background-color 0.2s ease'
};

const tableCellStyle = {
  padding: '12px',
  color: '#666'
};

const actionButton = {
  padding: '6px 12px',
  backgroundColor: '#7D6A5E',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
};

export default Tasks;