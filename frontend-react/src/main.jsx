// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';
import { AuthProvider } from './context/AuthContext'; // ✅ Importa AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Envuelve toda la app */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);