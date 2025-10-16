// src/components/AI/ReportViewer.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ReportViewer = () => {
  const { id } = useParams();
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`${API_URL}/ai/report/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('No se pudo cargar el informe');

        const data = await response.json();
        setReport(data.report);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // Función para exportar a PDF
  const handleExportPDF = () => {
    const element = document.getElementById('report-content');
    
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `informe-auditoria-${id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Opciones avanzadas para mejor calidad
    html2pdf().set(opt).from(element).save();
  };

  if (loading) return <div>Cargando informe...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{
      maxWidth: '900px',
      margin: '40px auto',
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Botón de descarga */}
      <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
        <button
          onClick={handleExportPDF}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#D4B9A5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#CAB09C'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#D4B9A5'}
        >
          🖨️ Descargar como PDF
        </button>
      </div>

      {/* Contenido del informe */}
      <div
        id="report-content"
        style={{
          minHeight: '500px',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #E8D6C6'
        }}
        dangerouslySetInnerHTML={{ __html: report }}
      />

      {/* Nota al pie */}
      <p style={{
        marginTop: '2rem',
        fontSize: '0.9rem',
        color: '#B8A89D',
        textAlign: 'center'
      }}>
        Informe generado por IA local - TS Bio Consulting
      </p>
    </div>
  );
};

export default ReportViewer;