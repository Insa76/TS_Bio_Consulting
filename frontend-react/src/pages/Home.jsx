// src/pages/Home.jsx
import React from 'react';
import ChatBotFloating from '../components/ChatBotFloating';

const Home = () => {
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '4rem auto',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif',
      color: '#7D6A5E',
      lineHeight: '1.8'
    }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        marginBottom: '4rem',
        padding: '3rem 2rem',
        backgroundColor: '#7d6a5ea2',
        borderRadius: '12px',
        border: '1px solid #fcfcfcff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.99)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '600',
          color: '#0a0a0ad7',
          marginBottom: '1rem'
        }}>
          TS Bio Consulting
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#ecebebff',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Creemos que la ciencia no solo se investiga, también se gestiona. Transformamos conocimiento en soluciones empresariales para el sector salud, acompañando a instituciones y profesionales hacia procesos más claros, eficientes y confiables.
        </p>
      </section>

      {/* Servicios */}
      <section style={{
        marginBottom: '4rem'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#0a0a0ad7',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Nuestros Servicios
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            'Consultoría Estrategica en Calidad y Bioseguridad',
            'Capacitación y Desarrollo Humano',
            'Optimización de Procesos y Asesoramiento Técnico',
          ].map((servicio, i) => (
            <div key={i} style={{
              padding: '1.5rem',
              backgroundColor: '#7d6a5ea2',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(2, 2, 2, 0.99)',
              //borderLeft: '4px solid #030303ff',
              //borderRight: '4px solid #030303ff'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#ecebebff',
                marginBottom: '0.5rem',
                
              }}>
                {servicio}
              </h3>
              <p style={{ color: '#ecebebff', fontSize: '0.95rem' }}>
                Asesoramiento personalizado para cumplir con normativas nacionales e internacionales.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre Nosotros */}
      <section style={{
        marginBottom: '4rem',
        padding: '2.5rem',
        backgroundColor: '#7d6a5ea2',
        borderRadius: '12px',
        border: '1px solid #fcfcfcff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.99)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#0a0a0ad7',
          marginBottom: '1rem'
        }}>
          Sobre Nosotros
        </h2>
        <p style={{ marginBottom: '1rem', color: '#ecebebff' }}>
          TS Bio Consulting es una consultora especializada en el sector salud, con más de 10 años de experiencia en:
        </p>
        <ul style={{
          listStyle: 'disc',
          paddingLeft: '1.5rem',
          marginBottom: '1rem',
          color: '#ecebebff',
        }}>
          <li>Implementación de comités de bioética</li>
          <li>Acreditación de instituciones sanitarias</li>
          <li>Diseño de protocolos clínicos</li>
          <li>Gestión de residuos peligrosos</li>
        </ul>
        <p style={{ color: '#ecebebff' }}>
          Trabajamos con clínicas, hospitales y centros de investigación para garantizar el cumplimiento legal y ético.
        </p>
      </section>

      {/* Contacto */}
      <section style={{
        textAlign: 'center',
        padding: '2.5rem',
        backgroundColor: '#7d6a5ea2',
        color: 'white',
        borderRadius: '12px',
        border: '1px solid #fcfcfcff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.99)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          ¿Listo para comenzar?
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Contactanos para una evaluación inicial.
        </p>
        <button style={{
          padding: '0.75rem 2rem',
          backgroundColor: '#D4B9A5',
          color: '#7D6A5E',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          <a
          href="https://wa.me/5491112345678?text=Hola,%20quiero%20más%20información%20sobre%20auditorías%20médicas"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: '2rem',
            padding: '0.75rem 2rem',
            backgroundColor: '#D4B9A5',
            color: '#7D6A5E',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Contactar por WhatsApp
        </a>
        </button>
      </section>
      {/* ChatBot Flotante */}
      <ChatBotFloating />
    </div>
  );
};

export default Home;