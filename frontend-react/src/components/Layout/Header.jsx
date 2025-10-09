// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: "1rem",
        width: "100%",
        height: "60px",
        backgroundColor: "#7D6A5E",
        borderBottom: "1px solid #E8D6C6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1rem",
        zIndex: 70, // ✅ Por encima del sidebar
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: "1.2rem",
          marginLeft: "1rem",
          fontWeight: "600",
          color: "#cfcdcbff",
        }}
      >
        TS Bio Consulting
      </div>

      {/* Menú hamburguesa (móvil) */}
      <button
        onClick={toggleMenu}
        style={{
          display: "none", // Oculto en desktop
          backgroundColor: "transparent",
          border: "none",
          fontSize: "1.5rem",
          color: "#7D6A5E",
          cursor: "pointer",
        }}
        className="lg:hidden"
      >
        ☰
      </button>

      {/* Navegación desktop */}
      <nav
        style={{
          display: "flex",
          gap: "2rem",
          fontSize: "0.95rem",
        }}
        className="hidden lg:flex"
      >
        <Link to="/" style={linkStyle}>
          Inicio
        </Link>
        <Link to="/servicios" style={linkStyle}>
          Servicios
        </Link>
        <Link to="/sobre-nosotros" style={linkStyle}>
          Sobre Nosotros
        </Link>
        <Link to="/contacto" style={linkStyle}>
          Contacto
        </Link>
      </nav>

      {/* Usuario logueado */}
      {user ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span style={{ color:"#cfcdcbff", fontSize: "0.9rem" }}>
            Hola, {user.name}
          </span>
          <button
            onClick={logout}
            style={{
              marginRight: "1.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#D4B9A5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#cfcdcbff",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontWeight: "500",
          }}
        >
          Iniciar sesión
        </Link>
      )}

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: 0,
            width: "100%",
            backgroundColor: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
          }}
        >
          <Link to="/" style={mobileLinkStyle} onClick={toggleMenu}>
            Inicio
          </Link>
          <Link to="/servicios" style={mobileLinkStyle} onClick={toggleMenu}>
            Servicios
          </Link>
          <Link
            to="/sobre-nosotros"
            style={mobileLinkStyle}
            onClick={toggleMenu}
          >
            Sobre Nosotros
          </Link>
          <Link to="/contacto" style={mobileLinkStyle} onClick={toggleMenu}>
            Contacto
          </Link>
          {user && (
            <button
              onClick={() => {
                logout();
                toggleMenu();
              }}
              style={{
                ...mobileLinkStyle,
                textAlign: "left",
                backgroundColor: "#D9A39A",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          )}
          {!user && (
            <Link to="/login" style={mobileLinkStyle} onClick={toggleMenu}>
              Iniciar sesión
            </Link>
          )}
          {!user && (
            <Link to="/register" style={mobileLinkStyle} onClick={toggleMenu}>
              Registrarse
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

// Estilos reutilizables
const linkStyle = {
  color: "#cfcdcbff",
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'color 0.3s ease'
};

const mobileLinkStyle = {
  padding: '0.75rem 1rem',
  color: '#7D6A5E',
  textDecoration: 'none',
  fontWeight: '500',
  borderRadius: '6px',
  marginBottom: '0.5rem',
  backgroundColor: '#F5E9DC',
  border: '1px solid #E8D6C6'
};

export default Header;