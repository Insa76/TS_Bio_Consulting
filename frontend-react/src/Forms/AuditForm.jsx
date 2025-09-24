import React, { useState } from 'react';
import { auditService } from '../../src/services/api';
import { useNavigate } from 'react-router-dom';

const AuditForm = () => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

    try {
      const response = await auditService.create(answers);
      setSubmitted(true);
      setTimeout(() => navigate('/reports'), 2000);
    } catch (err) {
      alert('Error al enviar la auditoría');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Auditoría enviada!</h2>
          <p className="text-gray-600">Generando su informe personalizado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Autoevaluación de Cumplimiento Sanitario</h1>
      <p className="text-gray-600 mb-8">
        Complete este cuestionario para obtener un diagnóstico automático de su cumplimiento normativo.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q) => (
          <div key={q.id} className="border p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-800 mb-4">{q.text}</h3>
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

        <button
          type="submit"
          disabled={loading || Object.keys(answers).length < questions.length}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generando informe...' : 'Finalizar y Generar Informe'}
        </button>
      </form>
    </div>
  );
};

export default AuditForm;