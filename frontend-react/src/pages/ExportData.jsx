// src/pages/ExportData.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ExportData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleExport = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/export/data', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Error al exportar datos');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tsbio-export-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      alert('✅ Datos exportados con éxito');
    } catch (err) {
      setError(err.message || 'No se pudieron exportar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '40px auto',
      padding: '20px',
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
        📤 Exportar Datos
      </h1>

      <p style={{
        color: '#B8A89D',
        marginBottom: '32px'
      }}>
        Exporta todos tus datos de auditorías, tareas y estadísticas en un solo archivo ZIP.
      </p>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#D9A39A',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: '#F5E9DC',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '32px'
      }}>
        <h2 style={{
          color: '#7D6A5E',
          marginBottom: '16px'
        }}>
          📦 Contenido del archivo ZIP
        </h2>

        <ul style={{
          listStyle: 'none',
          padding: 0,
          marginBottom: '24px'
        }}>
          <li style={{
            padding: '12px',
            backgroundColor: '#FFF',
            borderRadius: '6px',
            marginBottom: '8px',
            borderLeft: '4px solid #D4B9A5'
          }}>
            ✅ <strong>Auditorías realizadas</strong> (CSV)
          </li>
          <li style={{
            padding: '12px',
            backgroundColor: '#FFF',
            borderRadius: '6px',
            marginBottom: '8px',
            borderLeft: '4px solid #D4B9A5'
          }}>
            ✅ <strong>Tareas asignadas</strong> (CSV)
          </li>
          <li style={{
            padding: '12px',
            backgroundColor: '#FFF',
            borderRadius: '6px',
            marginBottom: '8px',
            borderLeft: '4px solid #D4B9A5'
          }}>
            ✅ <strong>Estadísticas de cumplimiento</strong> (TXT)
          </li>
          <li style={{
            padding: '12px',
            backgroundColor: '#FFF',
            borderRadius: '6px',
            marginBottom: '8px',
            borderLeft: '4px solid #D4B9A5'
          }}>
            ✅ <strong>Base de conocimiento usada</strong> (TXT)
          </li>
        </ul>

        <button
          onClick={handleExport}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 24px',
            backgroundColor: loading ? '#B8A89D' : '#7D6A5E',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          {loading ? 'Exportando datos...' : '📥 Descargar archivo ZIP'}
        </button>
      </div>

      <div style={{
        backgroundColor: '#FFF',
        padding: '16px',
        borderRadius: '8px',
        borderLeft: '4px solid #D4B9A5'
      }}>
        <strong>💡 Consejo:</strong> Usa este archivo para respaldar tus datos o compartirlos con auditores externos.
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

export default ExportData;