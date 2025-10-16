// src/components/TaskNotifications.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TaskNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Error al cargar notificaciones');

        const data = await response.json();
        setNotifications(data);

      } catch (err) {
        console.error("Error en notificaciones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return null;

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      width: '300px',
      backgroundColor: '#FFF',
      border: '1px solid #E8D6C6',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(125, 106, 94, 0.1)',
      zIndex: 1000,
      padding: '16px'
    }}>
      <h3 style={{
        color: '#7D6A5E',
        marginBottom: '12px',
        fontSize: '1rem',
        fontWeight: '600'
      }}>
        🚨 Notificaciones de Tareas
      </h3>

      {notifications.map((task) => {
        const deadline = new Date(task.deadline);
        const now = new Date();
        const isOverdue = deadline < now;
        const isSoon = !isOverdue && deadline - now < 48 * 60 * 60 * 1000; // 48 horas

        return (
          <div key={task.id} style={{
            padding: '12px',
            backgroundColor: isOverdue ? '#FADBD8' : isSoon ? '#FEF9E7' : '#FFF',
            borderLeft: `4px solid ${isOverdue ? '#E74C3C' : isSoon ? '#F39C12' : '#B8A89D'}`,
            marginBottom: '8px',
            borderRadius: '6px'
          }}>
            <strong style={{ color: isOverdue ? '#E74C3C' : isSoon ? '#F39C12' : '#7D6A5E' }}>
              {isOverdue ? '⚠️ VENCIDA' : isSoon ? '⏰ PRÓXIMA' : '📅 Pendiente'}
            </strong>
            <p style={{ margin: '8px 0', color: '#666' }}>
              {task.action}
            </p>
            <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#B8A89D' }}>
              Vence: {deadline.toLocaleDateString()} {deadline.toLocaleTimeString()}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TaskNotifications;