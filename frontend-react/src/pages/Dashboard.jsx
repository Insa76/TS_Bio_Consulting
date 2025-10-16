// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
  avgCompliance: 0,
  totalAudits: 0,
  pendingTasks: 0,
  completedTasks: 0,
  criticalAlerts: 0,
  recentAudits: [], // 👈 Cambiado de recentReports a recentAudits
});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Cargar estadísticas
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard/stats`, {
          headers: {
            'Authorization': 'Bearer fake-jwt-token-123',
          },
        });

        if (!response.ok) throw new Error('Error al cargar las estadísticas');

        const data = await response.json();
        setStats(data);

      } catch (err) {
        setError(err.message || 'No se pudieron cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <p style={{ color: '#7D6A5E', marginTop: '12px' }}>Cargando dashboard...</p>
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
    <div
      style={{
        maxWidth: "1200px",
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
        <img src="/images/ana.png" width="100px" height="100px" /> Panel Médico
        — Organizado por funcionalidad
      </h1>

      <p
        style={{
          color: "#B8A89D",
          marginBottom: "32px",
        }}
      >
        Bienvenido/a, {user?.name}. Aquí tienes todo lo que necesitas,
        organizado en 3 secciones:
      </p>

      {/* SECCIÓN 1: GESTIÓN DEL EQUIPO */}
      <div
        style={{
          backgroundColor: "#F5E9DC",
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "32px",
        }}
      >
        <h2
          style={{
            color: "#7D6A5E",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img src="/images/team2.png" width="50px" height="50px" /> Gestión del
          Equipo
        </h2>
        <p style={{ color: "#666", marginBottom: "16px" }}>
          Asigna tareas, gestiona miembros y sigue el progreso de tu equipo.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => navigate("/team")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#D4B9A5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Panel de Equipo
          </button>

          <button
            onClick={() => navigate("/create-team")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#7D6A5E",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            ➕ Crear Nuevo Equipo
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#FFF",
            padding: "16px",
            borderRadius: "8px",
            borderLeft: "4px solid #D4B9A5",
          }}
        >
          <strong>💡 Consejo:</strong> Usa esta sección para delegar tareas y
          seguir su estado.
        </div>
      </div>

      {/* SECCIÓN 2: FUNCIONES CON IA LOCAL */}
      <div
        style={{
          backgroundColor: "#F5E9DC",
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "32px",
        }}
      >
        <h2
          style={{
            color: "#7D6A5E",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img src="/images/brain.png" width="50px" height="50px" /> Funciones
          con IA Local
        </h2>
        <p style={{ color: "#666", marginBottom: "16px" }}>
          Genera informes, planes de acción y recomendaciones con inteligencia
          artificial.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => navigate("/audit")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#D4B9A5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Autoevaluación + Informe con IA
          </button>

          <button
            onClick={() => navigate("/tasks")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#7D6A5E",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Plan de Acción Automático
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#FFF",
            padding: "16px",
            borderRadius: "8px",
            borderLeft: "4px solid #D4B9A5",
          }}
        >
          <strong>💡 Consejo:</strong> La IA te ayuda a convertir respuestas en
          acciones concretas.
        </div>
      </div>

      {/* SECCIÓN 3: ANÁLISIS Y ESTADÍSTICAS */}
      <div
        style={{
          backgroundColor: "#F5E9DC",
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "32px",
        }}
      >
        <h2
          style={{
            color: "#7D6A5E",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <img src="/images/ana.png" width="50px" height="50px" /> Análisis y
          Estadísticas
        </h2>
        <p style={{ color: "#666", marginBottom: "16px" }}>
          Mide tu progreso, visualiza tendencias y exporta resultados.
        </p>

        {/* Gráfico de evolución */}
        <div
          style={{
            backgroundColor: "#FFF",
            padding: "24px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#7D6A5E", marginBottom: "16px" }}>
             Evolución del Cumplimiento
          </h3>
          {stats.recentAudits && stats.recentAudits.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={stats.recentAudits}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E8D6C6" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#7D6A5E", fontSize: 12 }}
                  axisLine={{ stroke: "#B8A89D" }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("es-AR")
                  }
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  label={{
                    value: "Nivel (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#7D6A5E",
                  }}
                  tick={{ fill: "#7D6A5E", fontSize: 12 }}
                  axisLine={{ stroke: "#B8A89D" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E8D6C6",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#7D6A5E" }}
                  formatter={(value) => [`${value}%`, "Cumplimiento"]}
                />
                <Legend
                  formatter={() => (
                    <span style={{ color: "#7D6A5E" }}>Cumplimiento</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#D4B9A5"
                  strokeWidth={3}
                  dot={{ r: 6, fill: "#7D6A5E" }}
                  activeDot={{ r: 8, fill: "#D4B9A5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#B8A89D",
              }}
            >
              <p>No hay auditorías recientes para mostrar.</p>
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#D4B9A5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Dashboard de Estadísticas
          </button>

          <button
            onClick={() => navigate("/reports")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#7D6A5E",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Historial de Informes
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#FFF",
            padding: "16px",
            borderRadius: "8px",
            borderLeft: "4px solid #D4B9A5",
          }}
        >
          <strong>💡 Consejo:</strong> Usa los gráficos para mostrar mejora a
          directivos o auditores externos.
        </div>
      </div>

      {/* BOTONES DE ACCESO RÁPIDO */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#B8A89D",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Volver al inicio
        </button>

        <button
          onClick={() => navigate("/audit")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#D4B9A5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Nueva Auditoría
        </button>

        <button
          onClick={() => navigate("/tasks")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#7D6A5E",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Gestionar Tareas
        </button>
      </div>
    </div>
  );
};

export default Dashboard;