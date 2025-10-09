// src/components/Layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ sidebarCollapsed, setSidebarCollapsed, isAdmin }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '60px',
      backgroundColor: 'white',
      borderBottom: '1px solid #E8D6C6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      zIndex: 50,
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
    }}>
      {/* Botón hamburguesa (solo en móviles) */}
      {isAdmin && (
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            display: 'none', // Oculto en desktop
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            color: '#7D6A5E',
            cursor: 'pointer'
          }}
          className="lg:hidden"
        >
          {sidebarCollapsed ? '☰' : '✕'}
        </button>
      )}

      {/* Logo */}
      <div style={{
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#7D6A5E'
      }}>
        TS Bio Consulting
      </div>

      {/* Navegación desktop */}
      <nav style={{
        display: 'flex',
        gap: '2rem',
        fontSize: '0.95rem'
      }} className="hidden lg:flex">
        <Link to="/" style={linkStyle}>Inicio</Link>
        <Link to="/servicios" style={linkStyle}>Servicios</Link>
        <Link to="/sobre-nosotros" style={linkStyle}>Sobre Nosotros</Link>
        <Link to="/contacto" style={linkStyle}>Contacto</Link>
      </nav>

      {/* Usuario logueado */}
      {user ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{ color: '#7D6A5E', fontSize: '0.9rem' }}>
            Hola, {user.name}
          </span>
          <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#D4B9A5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#D4B9A5',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          Iniciar sesión
        </Link>
      )}
    </header>
  );
};

// Estilo reutilizable para enlaces
const linkStyle = {
  color: '#7D6A5E',
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'color 0.3s ease'
};

export default Header;