// src/components/AI/ChatBot.jsx
import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ChatBot = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setAnswer('');

  try {
    const token = localStorage.getItem('token'); // ✅ Obtiene el token

    const response = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ✅ Envía el token
      },
      body: JSON.stringify({ question }) // ✅ Envía la pregunta
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error al generar respuesta');
    }

    const data = await response.json();
    setAnswer(data.answer);

  } catch (err) {
    setError(err.message || 'No se pudo generar la respuesta');
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
      fontFamily: 'Inter, sans-serif'
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#7D6A5E',
        marginBottom: '16px'
      }}>
        🤖 Asistente IA Legal
      </h2>

      <p style={{
        color: '#B8A89D',
        marginBottom: '32px'
      }}>
        Pregunta cualquier duda legal sobre normativas sanitarias argentinas.
      </p>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.95rem',
            color: '#7D6A5E',
            fontWeight: '500',
            marginBottom: '4px'
          }}>
            Tu pregunta
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #E8D6C6',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
            onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
          />
        </div>

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
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generando respuesta...' : 'Enviar pregunta'}
        </button>
      </form>

      {answer && (
        <div style={{
          marginTop: '32px',
          padding: '24px',
          backgroundColor: '#F0F7FF',
          borderLeft: '4px solid #1A3A7D',
          borderRadius: '8px'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1A3A7D',
            marginBottom: '16px'
          }}>
            📋 Respuesta Legal
          </h3>
          <div dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, '<br>') }} />
        </div>
      )}
    </div>
  );
};

export default ChatBot;