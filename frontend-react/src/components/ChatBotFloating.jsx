// src/components/ChatBotFloating.jsx
import React, { useState } from 'react';

const ChatBotFloating = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy tu asistente virtual de TS Bio Consulting. ¿En qué puedo ayudarte?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  // Palabras clave que indican necesidad de contacto humano
  const shouldDerive = (text) => {
    const keywords = [
      "hablar con alguien", "quiero un asesor", "contacto", "humano",
      "agendar cita", "necesito ayuda real", "no entiendo", "personalizado",
      "llame", "telefono", "whatsapp", "directo", "experto"
    ];
    return keywords.some(kw => text.toLowerCase().includes(kw));
  };

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { text: input, sender: "user" };
  setMessages(prev => [...prev, userMessage]);
  setInput("");

  // Usar session_id del localStorage o generar uno nuevo
  let sessionId = localStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('chat_session_id', sessionId);
  }

  try {
    // Enviar mensaje y recibir respuesta + guardado en DB
    const response = await fetch('http://localhost:8000/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, session_id: sessionId })
    });

    const data = await response.json();

    const botMessage = { 
      text: data.response, 
      sender: "bot" 
    };
    setMessages(prev => [...prev, botMessage]);

    // Si la IA sugiere contacto → mostrar WhatsApp
    if (data.response.toLowerCase().includes("whatsapp") || 
        data.response.toLowerCase().includes("contactar")) {
      
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/5491112345678?text=Hola,%20soy%20del%20chatbot:%20${encodeURIComponent(input)}`;
        const buttonMsg = {
          text: (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={whatsappButtonStyle}
            >
              💬 Hablar con un asesor
            </a>
          ),
          sender: "bot",
          isButton: true
        };
        setMessages(prev => [...prev, buttonMsg]);
      }, 600);
    }

  } catch (error) {
    const errorMsg = {
      text: "No pude conectar. Por favor, contacta por WhatsApp.",
      sender: "bot"
    };
    setMessages(prev => [...prev, errorMsg]);

    const whatsappFallback = {
      text: (
        <a
          href="https://wa.me/5491112345678"
          target="_blank"
          rel="noopener noreferrer"
          style={whatsappButtonStyle}
        >
          💬 Contactar por WhatsApp
        </a>
      ),
      sender: "bot",
      isButton: true
    };
    setMessages(prev => [...prev, whatsappFallback]);
  }
};
  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#7D6A5E',
          color: 'white',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(125, 106, 94, 0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        💬
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '2rem',
          width: '350px',
          maxHeight: '500px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#7D6A5E',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <strong>Asistente Virtual</strong>
            <button
              onClick={toggleChat}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ×
            </button>
          </div>

          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            backgroundColor: '#F5E9DC',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#D4B9A5' : '#E8D6C6',
                  color: msg.sender === 'user' ? 'white' : '#7D6A5E',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  fontSize: '0.95rem'
                }}
              >
                {typeof msg.text === 'string' ? msg.text : msg.text}
              </div>
            ))}
          </div>

          <div style={{
            padding: '0.75rem',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta aquí..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #E8D6C6',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#7D6A5E',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              📤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotFloating;