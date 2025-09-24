import React, { useState } from 'react';
import axios from '../../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¿Tienes dudas sobre cumplimiento sanitario? Pregúntame.' }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');

    try {
      const res = await axios.post('/ai/chat', { question: input });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Lo siento, hubo un error. Intenta más tarde.' }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          ❓
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-xl w-80 h-96 flex flex-col">
          <div className="p-4 border-b font-semibold">🤖 Chat Legal</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-xs p-2 rounded-lg ${
                  msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Pregunta algo..."
              className="flex-1 p-2 border rounded-l focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 rounded-r"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;