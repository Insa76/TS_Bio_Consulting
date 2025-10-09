// src/layouts/AdminLayout.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const AdminLayout = ({ children }) => {
  const { isAdmin } = useAuth();

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      backgroundImage: 'url(/images/bg1.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* Sidebar: Solo visible si es admin */}
      {isAdmin && <Sidebar />}

      {/* Contenido principal */}
      <main style={{
        marginLeft: isAdmin ? '256px' : '0',
        width: isAdmin ? `calc(100% - 256px)` : '100%',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <Header />

        <div style={{
          marginTop: '60px',
          flexGrow: 1,
          padding: '2rem'
        }}>
          {children}
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default AdminLayout;