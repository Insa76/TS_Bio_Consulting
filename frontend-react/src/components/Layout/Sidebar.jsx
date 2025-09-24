// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Panel de Control', icon: '📊' },
    { path: '/audit', label: 'Autoevaluación', icon: '📋' },
    { path: '/reports', label: 'Informes Generados', icon: '📄' },
    { path: '/settings', label: 'Configuración', icon: '⚙️' },
  ];

  return (
    <aside style={{
      width: '256px',
      height: '100vh',
      backgroundColor: '#7D6A5E',
      color: 'white',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '4px 0 12px rgba(0,0,0,0.1)',
      zIndex: 60
    }}>
      
      {/* Encabezado del Sidebar */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #B8A89D',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          margin: 0
        }}>
          Panel Médico
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: '#E8D6C6',
          marginTop: '0.25rem'
        }}>
          Con IA Local
        </p>
      </div>

      {/* Menú Principal */}
      <nav style={{
        flex: 1,
        padding: '1.25rem',
        overflowY: 'auto'
      }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '0.5rem',
              color: location.pathname === item.path ? 'white' : '#E8D6C6',
              backgroundColor: location.pathname === item.path ? '#D4B9A5' : 'transparent',
              textDecoration: 'none',
              fontSize: '0.95rem',
              transition: 'background-color 0.3s ease'
            }}
          >
            <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Botón de cierre de sesión */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #B8A89D'
      }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '0.75rem 1rem',
            backgroundColor: 'transparent',
            color: '#D9A39A',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#B8A89D'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;