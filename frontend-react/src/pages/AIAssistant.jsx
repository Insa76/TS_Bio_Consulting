// src/pages/AIAssistant.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu asistente legal con IA local. ¿En qué puedo ayudarte?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:8000/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-jwt-token-123',
        },
        body: JSON.stringify({ question: input })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error al generar respuesta');
      }

      const data = await response.json();
      const botMessage = { text: data.answer, sender: "bot" };
      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      setError(err.message || 'No se pudo generar la respuesta');
      const errorMessage = { text: "❌ No pude generar la respuesta. Intenta nuevamente.", sender: "bot" };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
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
        🤖 Asistente Legal con IA Local
      </h1>

      <p style={{
        color: '#B8A89D',
        marginBottom: '32px'
      }}>
        Pregunta cualquier duda legal sobre normativas sanitarias argentinas.
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

      {/* Chat container */}
      <div style={{
        backgroundColor: '#F5E9DC',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '32px'
      }}>
        <div style={{
          height: '400px',
          overflowY: 'auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: '16px',
                textAlign: msg.sender === 'user' ? 'right' : 'left'
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: msg.sender === 'user' ? '#D4B9A5' : '#E8D6C6',
                  color: msg.sender === 'user' ? 'white' : '#7D6A5E',
                  maxWidth: '80%',
                  wordWrap: 'break-word'
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #E8D6C6',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
            onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#B8A89D' : '#7D6A5E',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        style={{
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

export default AIAssistant;