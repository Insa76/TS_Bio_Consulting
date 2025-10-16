// src/pages/Reports.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Importar recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Reports = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filtros
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [complianceFilter, setComplianceFilter] = useState('');

  // Cargar auditorías desde el backend
  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await fetch(`${API_URL}/audits`, {
          headers: {
            'Authorization': 'Bearer fake-jwt-token-123',
          },
        });

        if (!response.ok) throw new Error('Error al cargar las auditorías');
        
        const data = await response.json();
        setAudits(data);
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los informes');
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

  // Obtener nivel de cumplimiento
  const getComplianceLevel = (score) => {
    return score >= 80 ? 'Alto' : score >= 50 ? 'Medio' : 'Bajo';
  };

  // Color según nivel
  const getLevelColor = (score) => {
    return score >= 80 ? '#4CAF50' : score >= 50 ? '#FF9800' : '#F44336';
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR');
  };

  // Validar si la auditoría cumple con los filtros
  const matchesFilters = (audit) => {
    const auditDate = new Date(audit.created_at);

    // Filtro por fecha desde
    if (fromDate && auditDate < new Date(fromDate)) return false;

    // Filtro por fecha hasta
    if (toDate && auditDate > new Date(toDate)) return false;

    // Filtro por nivel de cumplimiento
    if (complianceFilter) {
      const level = getComplianceLevel(audit.score);
      if (level !== complianceFilter) return false;
    }

    return true;
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFromDate('');
    setToDate('');
    setComplianceFilter('');
  };

  // Auditorías filtradas
  const filteredAudits = audits.filter(matchesFilters);

  // Datos para el gráfico
  const chartData = filteredAudits
    .filter(audit => audit.score !== null)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map(audit => ({
      fecha: new Date(audit.created_at).toLocaleDateString('es-AR'),
      cumplimiento: audit.score
    }));

  // Ver informe
  const viewReport = (audit) => {
    localStorage.setItem('viewingReport', JSON.stringify({
      report: audit.report,
      date: audit.created_at,
      score: audit.score
    }));
    navigate('/audit');
  };

  // Generar PDF del informe
  const generatePDF = (audit) => {
    const input = document.createElement('div');
    Object.assign(input.style, {
      padding: '24px',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif',
      width: '210mm',
      minHeight: '297mm'
    });

    input.innerHTML = `
      <h2 style="color: #1A3A7D;">📋 Informe de Auditoría Sanitaria</h2>
      <p><strong>Cliente:</strong> ${user?.organization || 'Sin organización'}</p>
      <p><strong>Fecha:</strong> ${formatDate(audit.created_at)}</p>
      <p><strong>Nivel de Cumplimiento:</strong> ${getComplianceLevel(audit.score)} (${audit.score}%)</p>
      <hr style="margin: 16px 0; border-color: #ccc;" />
      <div>${audit.report}</div>
    `;

    document.body.appendChild(input);
    
    import('jspdf').then(({ jsPDF }) => {
      import('html2canvas').then((html2canvas) => {
        html2canvas.default(input).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const width = pdf.internal.pageSize.getWidth();
          const height = (canvas.height * width) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, width, height);
          const fileName = `informe-auditoria-${audit.id}.pdf`;
          pdf.save(fileName);
          document.body.removeChild(input);
        });
      });
    });
  };

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ['Fecha', 'Nivel de Cumplimiento (%)', 'Estado del Informe'];
    const rows = filteredAudits.map(audit => [
      formatDate(audit.created_at),
      audit.score,
      audit.report ? 'Generado' : 'Pendiente'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `historial-auditorias-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '40px auto',
      padding: '32px',
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
        <img src="/images/doc2.png" width="100px" height="100px" />Historial de Auditorías
      </h1>

      <p style={{
        color: '#B8A89D',
        marginBottom: '32px'
      }}>
        Revisa todos los informes generados por TS Bio Consulting.
      </p>

      {/* Controles de filtro */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#F5E9DC',
        borderRadius: '8px'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', color: '#7D6A5E', marginBottom: '4px' }}>
            Desde
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #E8D6C6'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', color: '#7D6A5E', marginBottom: '4px' }}>
            Hasta
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #E8D6C6'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', color: '#7D6A5E', marginBottom: '4px' }}>
            Nivel
          </label>
          <select
            value={complianceFilter}
            onChange={(e) => setComplianceFilter(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #E8D6C6'
            }}
          >
            <option value="">Todos</option>
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
          </select>
        </div>

        <button
          onClick={clearFilters}
          style={{
            alignSelf: 'flex-end',
            padding: '8px 16px',
            backgroundColor: '#B8A89D',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Limpiar
        </button>

        <button
          onClick={exportToCSV}
          disabled={filteredAudits.length === 0}
          style={{
            alignSelf: 'flex-end',
            padding: '8px 16px',
            backgroundColor: filteredAudits.length === 0 ? '#B8A89D' : '#7D6A5E',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: filteredAudits.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          📤 Exportar a CSV
        </button>
      </div>

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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            display: 'inline-block',
            width: '32px',
            height: '32px',
            border: '4px solid #D4B9A5',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#7D6A5E', marginTop: '12px' }}>Cargando historial...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : filteredAudits.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#B8A89D',
          border: '2px dashed #E8D6C6',
          borderRadius: '8px'
        }}>
          <p>{audits.length === 0 ? 'No has realizado ninguna auditoría aún.' : 'No hay auditorías que coincidan con los filtros.'}</p>
          {audits.length > 0 && (
            <button
              onClick={clearFilters}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#D4B9A5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Mostrar todas
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Tabla de auditorías */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '20px'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#F5E9DC',
                  color: '#7D6A5E'
                }}>
                  <th style={tableHeaderStyle}>Fecha</th>
                  <th style={tableHeaderStyle}>Cumplimiento</th>
                  <th style={tableHeaderStyle}>Estado</th>
                  <th style={tableHeaderStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudits.map((audit) => (
                  <tr key={audit.id} style={tableRowStyle}>
                    <td style={tableCellStyle}>{formatDate(audit.created_at)}</td>
                    <td style={tableCellStyle}>
                      <span style={{
                        color: getLevelColor(audit.score),
                        fontWeight: '500'
                      }}>
                        {getComplianceLevel(audit.score)} ({audit.score}%)
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{
                        color: audit.report ? '#4CAF50' : '#B8A89D',
                        fontWeight: '500'
                      }}>
                        {audit.report ? '✅ Informe generado' : '⏳ Pendiente'}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      {audit.report ? (
                        <>
                          <button
                            onClick={() => viewReport(audit)}
                            style={{ ...actionButton, marginRight: '8px' }}
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => generatePDF(audit)}
                            style={actionButton}
                          >
                            PDF
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => navigate('/audit')}
                          style={{ ...actionButton, backgroundColor: '#B8A89D' }}
                        >
                          Finalizar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Gráfico de evolución */}
          {filteredAudits.length > 1 && (
            <div style={{
              marginTop: '40px',
              padding: '24px',
              backgroundColor: '#F5E9DC',
              borderRadius: '12px',
              border: '1px solid #E8D6C6'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#7D6A5E',
                marginBottom: '16px'
              }}>
                📊 Evolución del Cumplimiento
              </h2>
              <p style={{ color: '#B8A89D', marginBottom: '20px' }}>
                Historial de niveles de cumplimiento en tus auditorías.
              </p>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8D6C6" />
                  <XAxis 
                    dataKey="fecha" 
                    tick={{ fill: '#7D6A5E', fontSize: 12 }} 
                    axisLine={{ stroke: '#B8A89D' }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    ticks={[0, 20, 40, 60, 80, 100]}
                    label={{ 
                      value: 'Nivel (%)', 
                      angle: -90, 
                      position: 'insideLeft', 
                      fill: '#7D6A5E' 
                    }}
                    tick={{ fill: '#7D6A5E', fontSize: 12 }}
                    axisLine={{ stroke: '#B8A89D' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E8D6C6', 
                      borderRadius: '8px' 
                    }}
                    labelStyle={{ color: '#7D6A5E' }}
                  />
                  <Legend formatter={() => <span style={{ color: '#7D6A5E' }}>Cumplimiento</span>} />
                  <Line
                    type="monotone"
                    dataKey="cumplimiento"
                    stroke="#D4B9A5"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#7D6A5E' }}
                    activeDot={{ r: 8, fill: '#D4B9A5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Estilos reutilizables
const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #E8D6C6',
  backgroundColor: '#F5E9DC',
  color: '#7D6A5E'
};

const tableRowStyle = {
  borderBottom: '1px solid #E8D6C6',
  transition: 'background-color 0.2s ease'
};

const tableCellStyle = {
  padding: '12px',
  color: '#666'
};

const actionButton = {
  padding: '6px 12px',
  backgroundColor: '#7D6A5E',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
};

export default Reports;