// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  // Estado para controlar qué sección está expandida
  const [expandedSection, setExpandedSection] = useState(null);

  // Definimos las secciones
  const sections = [
    {
      title: "Gestión del Equipo",
      key: "team",
      icon: "/images/team.png", // ← Tu ícono local
      items: [
        { path: '/team', label: 'Panel de Equipo', icon: '' },
        { path: '/create-team', label: 'Crear Nuevo Equipo', icon: '' },
        { path:'/teams', label: 'Gestión de Equipos'}
        
      ]
    },
    {
      title: "Funciones con IA Local",
      key: "ai",
      icon: "/images/ia.png", // Opcional: ícono para IA
      items: [
        { path: '/audit', label: 'Autoevaluación + IA', icon: '' },
        { path: '/reports', label: 'Informes Generados', icon: '' },
        { path: '/ai-assistant', label: 'Asistente IA (próximamente)', icon: '' }
      ]
    },
    {
      title: "Análisis y Estadísticas",
      key: "stats",
      icon: "/images/analisis.png", // Opcional: ícono para estadísticas
      items: [
        { path: '/dashboard', label: 'Dashboard General', icon: '' },
        { path: '/tasks', label: 'Tareas Asignadas', icon: '' },
        { path: '/export', label: 'Exportar Datos', icon: '' }
      ]
    }
  ];

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '256px',
      height: '100vh',
      backgroundColor: '#7D6A5E',
      color: 'white',
      zIndex: 60,
      boxShadow: '4px 0 12px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Encabezado */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #B8A89D',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>Panel Médico</h2>
        <p style={{ fontSize: '0.85rem', color: '#E8D6C6', marginTop: '0.25rem' }}>Con IA Local</p>
      </div>

      {/* Menú por secciones */}
      <nav style={{
        flex: 1,
        padding: '1.25rem',
        overflowY: 'auto'
      }}>
        {sections.map((section) => (
          <div key={section.key} style={{
            marginBottom: '1.5rem'
          }}>
            {/* Título de la sección con ícono */}
            <div
              onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                color: expandedSection === section.key ? 'white' : '#E8D6C6',
                backgroundColor: expandedSection === section.key ? '#B8A89D' : 'transparent',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src={section.icon} 
                  alt={section.title} 
                  style={{ width: '20px', height: '20px', filter: 'invert(1)' }} 
                />
                <span>{section.title}</span>
              </div>
              <span style={{ fontSize: '0.9rem' }}>
                {expandedSection === section.key ? '▼' : '▶'}
              </span>
            </div>

            {/* Menú desplegable */}
            {expandedSection === section.key && (
              <div style={{
                paddingLeft: '1rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                borderLeft: '4px solid #D4B9A5'
              }}>
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'block',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      marginBottom: '0.5rem',
                      color: location.pathname === item.path ? 'white' : '#E8D6C6',
                      backgroundColor: location.pathname === item.path ? '#9C8B7E' : 'transparent',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Cerrar sesión */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #B8A89D',
        textAlign: 'center'
      }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#9C8B7E',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;