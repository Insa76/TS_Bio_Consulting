// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: '0', // Empieza desde el borde izquierdo
      width: '100%',
      height: '60px',
      backgroundColor: '#7c695eee',
      borderBottom: '1px solid #4e4e4eff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      //padding: '0 1.5rem',
      zIndex: 50,
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
    }}>
      {/* Logo */}
      <div style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#161515ff',
        paddingLeft: "0.5rem",
      }}>
        TS Bio Consulting
      </div>

      {/* Navegación Institucional */}
      <nav style={{
        display: 'flex',
        gap: '2rem',
        fontSize: '0.95rem',
        flex: 1,
        justifyContent: 'center'
        
      }}>
        <Link to="/" style={linkStyle}>Inicio</Link>
        <Link to="/servicios" style={linkStyle}>Servicios</Link>
        <Link to="/sobre-nosotros" style={linkStyle}>Sobre Nosotros</Link>
        <Link to="/contacto" style={linkStyle}>Contacto</Link>
      </nav>

      {/* Botón de Sesión */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        fontSize: '0.95rem',
        paddingRight: "0.5rem",
      }}>
        {!user ? (
          <>
            <Link to="/login" style={{ ...buttonStyle, color: '#D4B9A5', border: '1px solid #524942ff' }}>
              Iniciar sesión
            </Link>
            <Link to="/register" style={buttonStyle}>
              Registrarse
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            style={{
              ...buttonStyle,
              background: '#504d4dff',
              color: 'white',
              border: 'none',
              textAlign: "center"
              
            }}
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  );
};

// Estilo común para los enlaces
const linkStyle = {
  color: '#000000ff',
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'color 0.3s ease'
};

// Estilo para botones
const buttonStyle = {
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#524f4cff',
  color: '#c7c1bbff',
  cursor: 'pointer',
  fontSize: '0.95rem',
  fontWeight: '500',
  transition: 'background-color 0.3s ease'
};

export default Header;