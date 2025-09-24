import React, { useState } from 'react';
import axios from 'axios';

const AutoEvaluation = () => {
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState(null);

  const questions = [
    { id: 'q1', text: '¿Tiene un Comité de Bioética activo?' },
    { id: 'q2', text: '¿Sus consentimientos informados cumplen con la Ley 26.529?' },
    { id: 'q3', text: '¿Realiza seguimiento de residuos peligrosos según la Ley 25.916?' },
    { id: 'q4', text: '¿Tiene un sistema de Historia Clínica Electrónica?' }
  ];

  const handleSubmit = async () => {
    const res = await axios.post('/api/generate-report', { answers });
    setReport(res.data.report);
  };

  return (
    <div>
      <h1>Autoevaluación de Cumplimiento</h1>
      {questions.map(q => (
        <div key={q.id}>
          <label>{q.text}</label>
          <select onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}>
            <option value="">Seleccionar...</option>
            <option value="yes">Sí</option>
            <option value="partial">Parcialmente</option>
            <option value="no">No</option>
          </select>
        </div>
      ))}
      <button onClick={handleSubmit}>Generar Informe</button>

      {report && <div dangerouslySetInnerHTML={{ __html: report }} />}
    </div>
  );
};

export default AutoEvaluation;