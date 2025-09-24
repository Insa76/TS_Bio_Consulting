// src/pages/AuditPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuditPage = () => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [auditId, setAuditId] = useState(null);
  const [report, setReport] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const questions = [
    {
      id: 'q1',
      text: '¿Tiene un Comité de Bioética activo y registrado?',
      options: ['Sí, formalizado y funcional', 'Sí, pero no documentado', 'No, aún no lo tenemos', 'No aplica']
    },
    {
      id: 'q2',
      text: '¿Sus consentimientos informados cumplen con la Ley 26.529?',
      options: ['Sí, todos están actualizados', 'Parcialmente, faltan algunos', 'No, no los revisamos', 'No aplica']
    },
    {
      id: 'q3',
      text: '¿Realiza seguimiento de residuos peligrosos según la Ley 25.916?',
      options: ['Sí, con contrato y registro', 'Solo guardamos registros', 'No, no lo hacemos', 'No aplica']
    },
    {
      id: 'q4',
      text: '¿Tiene un sistema de Historia Clínica Electrónica (HCE)?',
      options: ['Sí, integrado y seguro', 'Sí, pero en papel digital', 'No, uso papel', 'No aplica']
    },
    {
      id: 'q5',
      text: '¿Su clínica tiene protocolos estandarizados para emergencias?',
      options: ['Sí, documentados y capacitados', 'Sí, pero no actualizados', 'No, improvisamos', 'No aplica']
    },
  ];

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setReport('');

  try {
    // Paso 1: Guardar auditoría
    const response = await fetch('http://localhost:8000/audits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        score: Object.keys(answers).length * 20,
        answers: answers
      })
    });

    if (!response.ok) throw new Error('Error al enviar la auditoría');
    
    const auditData = await response.json();

    // Paso 2: Obtener informe de IA
    const aiResponse = await fetch(`http://localhost:8000/ai/report/${auditData.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });

    if (!aiResponse.ok) throw new Error('Error al generar el informe');

    const reportData = await aiResponse.json();
    setReport(reportData.report);

  } catch (err) {
    setError(err.message || 'Ocurrió un error inesperado');
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(125, 106, 94, 0.1)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#7D6A5E',
        textAlign: 'center',
        marginBottom: '16px'
      }}>
        Autoevaluación de Cumplimiento Sanitario
      </h1>

      <p style={{
        color: '#B8A89D',
        textAlign: 'center',
        marginBottom: '32px',
        fontSize: '1rem'
      }}>
        Complete este cuestionario para obtener un diagnóstico automático.
      </p>

      {report ? (
        <div style={{
          padding: '24px',
          backgroundColor: '#F0F7FF',
          borderLeft: '4px solid #1A3A7D',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1A3A7D' }}>📋 Informe Generado</h2>
          <div dangerouslySetInnerHTML={{ __html: report }} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {questions.map((q) => (
            <div key={q.id} style={{
              padding: '20px',
              border: '1px solid #E8D6C6',
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <h3 style={{
                fontWeight: '600',
                color: '#7D6A5E',
                marginBottom: '12px'
              }}>
                {q.text}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((option, index) => (
                  <label key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: '#666'
                  }}>
                    <input
                      type="radio"
                      name={q.id}
                      value={option}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      style={{ marginRight: '12px', accentColor: '#D4B9A5' }}
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#D9A39A',
              color: 'white',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || Object.keys(answers).length < questions.length}
            style={{
              padding: '12px 24px',
              backgroundColor: loading || Object.keys(answers).length < questions.length 
                ? '#B8A89D' 
                : '#D4B9A5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading || Object.keys(answers).length < questions.length 
                ? 'not-allowed' 
                : 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            {loading ? 'Generando informe...' : 'Finalizar y Generar Informe'}
          </button>
        </form>
      )}

      {auditId && !report && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          marginTop: '20px'
        }}>
          <div style={{
            display: 'inline-block',
            width: '32px',
            height: '32px',
            border: '4px solid #D4B9A5',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#7D6A5E', marginTop: '12px' }}>Generando su informe personalizado...</p>
        </div>
      )}
    </div>
  );
};

// Añadimos el estilo animado directamente en el head (opcional)
if (document.styleSheets.length === 0) {
  const style = document.createElement('style');
  document.head.appendChild(style);
}

const styleSheet = document.styleSheets[0];
const rule = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

try {
  styleSheet.insertRule(rule, styleSheet.cssRules.length);
} catch (e) {
  console.warn('No se pudo insertar la regla CSS:', e);
}

export default AuditPage;