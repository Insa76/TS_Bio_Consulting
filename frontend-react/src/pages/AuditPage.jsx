// src/pages/AuditPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const AuditPage = () => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Preguntas del cuestionario
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

  // Cargar respuestas desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('auditAnswers');
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        console.warn("No se pudo cargar respuestas guardadas");
      }
    }
  }, []);

  // Función para extraer el plan de acción del texto del informe
  const extractActionPlan = (report) => {
    if (!report) return [];

    const lines = report.split('\n');
    const actionPlan = [];
    let capturing = false;

    for (let line of lines) {
      if (line.includes('PLAN DE ACCIÓN AUTOMÁTICO')) {
        capturing = true;
        continue;
      }

      if (capturing && line.trim().startsWith('-')) {
        // Extraer acción, responsable, plazo, indicador
        const match = line.match(/- Acción: (.+?)\s*Responsable: (.+?)\s*Plazo: (.+?)\s*Indicador: (.+)/);
        if (match) {
          actionPlan.push({
            action: match[1].trim(),
            responsible: match[2].trim(),
            deadline: match[3].trim(),
            successIndicator: match[4].trim()
          });
        }
      }

      if (capturing && line.trim().length === 0) {
        break; // Fin del plan de acción
      }
    }

    return actionPlan;
  };

  // Guardar respuesta y en localStorage
  const handleChange = (id, value) => {
    const newAnswers = { ...answers, [id]: value };
    setAnswers(newAnswers);
    localStorage.setItem('auditAnswers', JSON.stringify(newAnswers));
  };

  // Enviar auditoría y generar informe
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Object.keys(answers).length < questions.length) {
      setError('Por favor, responda todas las preguntas.');
      return;
    }

    setLoading(true);

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
          'Authorization': 'Bearer fake-jwt-token-123',
        }
      });

      if (!aiResponse.ok) throw new Error('Error al generar el informe');

      const reportData = await aiResponse.json();
      setReport(reportData.report);

      // Limpiar respuestas después de éxito
      localStorage.removeItem('auditAnswers');

    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  // Generar PDF del informe
  const generatePDF = () => {
    const input = document.getElementById('report-content');
    const button = document.activeElement;

    button.disabled = true;
    button.innerText = 'Generando PDF...';

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#fff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      const fileName = `informe-auditoria-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      button.disabled = false;
      button.innerText = '📄 Descargar Informe en PDF';
    });
  };

  // Asignar tarea
  const assignTask = async (action, responsible, deadline) => {
    try {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-jwt-token-123',
        },
        body: JSON.stringify({
          audit_id: reportId,
          action,
          responsible,
          deadline: new Date(deadline).toISOString()
        })
      });

      if (!response.ok) throw new Error('Error al asignar la tarea');

      alert(`Tarea asignada a ${responsible} con vencimiento el ${deadline}`);
    } catch (error) {
      console.error("Error al asignar tarea:", error);
      alert("No se pudo asignar la tarea. Revisa los datos.");
    }
  };

  // Estado para guardar el ID del informe
  const [reportId, setReportId] = useState(null);

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

      {/* Mostrar informe si ya se generó */}
      {report ? (
        <>
          <div id="report-content" style={{
            padding: '24px',
            backgroundColor: '#F0F7FF',
            borderLeft: '4px solid #1A3A7D',
            borderRadius: '8px',
            marginTop: '20px',
            minHeight: '297mm' // A4 height
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1A3A7D' }}>
              📋 Informe de Auditoría Sanitaria
            </h2>
            <p><strong>Cliente:</strong> {user?.organization || 'Sin organización'}</p>
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-AR')}</p>
            <hr style={{ margin: '16px 0', borderColor: '#B8A89D' }} />
            <div dangerouslySetInnerHTML={{ __html: report }} />
          </div>

          {/* Plan de Acción */}
          <div style={{
            marginTop: '30px',
            padding: '24px',
            backgroundColor: '#FFF',
            borderRadius: '8px',
            border: '1px solid #E8D6C6'
          }}>
            <h3 style={{ color: '#7D6A5E', marginBottom: '16px' }}>🚀 Plan de Acción Automático</h3>
            {extractActionPlan(report).map((action, index) => (
              <div key={index} style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#F5E9DC',
                borderRadius: '6px',
                borderLeft: '4px solid #D4B9A5'
              }}>
                <strong>{index + 1}. {action.action}</strong>
                <p style={{ margin: '8px 0', color: '#666' }}>
                  <span style={{ fontWeight: 'bold' }}>Responsable:</span> {action.responsible} | 
                  <span style={{ fontWeight: 'bold' }}>Plazo:</span> {action.deadline}
                </p>
                <p style={{ margin: '8px 0', color: '#666' }}>
                  <span style={{ fontWeight: 'bold' }}>Indicador de éxito:</span> {action.successIndicator}
                </p>

                {/* Botón para asignar tarea */}
                <button
                  onClick={() => assignTask(action.action, action.responsible, action.deadline)}
                  style={{
                    marginTop: '8px',
                    padding: '6px 12px',
                    backgroundColor: '#7D6A5E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  📌 Asignar tarea
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={generatePDF}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#7D6A5E',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📄 Descargar Informe en PDF
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              marginTop: '10px',
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
        </>
      ) : (
        /* Formulario de auditoría */
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
                      checked={answers[q.id] === option}
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
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#B8A89D' : '#D4B9A5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            {loading ? 'Generando informe...' : 'Finalizar y Generar Informe'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AuditPage;