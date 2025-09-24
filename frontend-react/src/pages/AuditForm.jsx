import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuditForm = () => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [auditId, setAuditId] = useState(null);
  const [report, setReport] = useState('');
  const navigate = useNavigate();

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
      const response = await fetch('http://localhost:8000/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: Object.keys(answers).length * 20,
          answers: answers
        })
      });

      if (!response.ok) throw new Error('Error al enviar la auditoría');

      const data = await response.json();
      setAuditId(data.id);

      const reportResponse = await fetch(`http://localhost:8000/ai/report/${data.id}`);
      if (!reportResponse.ok) throw new Error('Error al generar el informe');

      const reportData = await reportResponse.json();
      setReport(reportData.report);

    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Autoevaluación de Cumplimiento Sanitario</h1>
        <p className="text-gray-600 mb-8">
          Complete este cuestionario para obtener un diagnóstico automático de su cumplimiento normativo.
        </p>

        {report ? (
          <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📋 Informe Generado</h2>
            <div dangerouslySetInnerHTML={{ __html: report }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="border p-5 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">{q.text}</h3>
                <div className="space-y-2">
                  {q.options.map((option, index) => (
                    <label key={index} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={q.id}
                        value={option}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        className="mr-3 h-5 w-5 text-blue-600"
                        required
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || Object.keys(answers).length < questions.length}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition ${
                loading || Object.keys(answers).length < questions.length
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Generando informe...' : 'Finalizar y Generar Informe'}
            </button>
          </form>
        )}

        {auditId && !report && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generando su informe personalizado...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditForm;