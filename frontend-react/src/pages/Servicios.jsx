// src/pages/Servicios.jsx
import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Servicios = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5E9DC',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '6px'
    }}>
      <Header />

      <main style={{
        padding: '4rem 1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
        lineHeight: '1.8'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '600',
          color: '#7D6A5E',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Nuestros Servicios
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: '#B8A89D',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Ofrecemos una amplia cartera de soluciones orientadas a resolver los problemas y a detectar las oportunidades de mejora de cada uno de nuestros clientes.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginTop: '2rem'
        }}>
          {[
            {
      desc: "Diagnóstico y asesoramiento en sistemas de gestión de calidad (ISO 9001, ISO 15189, entre otros).",
      
    },
    {
      desc: "Implementación de buenas prácticas en laboratorios, clínicas e instituciones de salud.",
      
    },
    {
      desc: "Apoyo en diseño, gestión y cumplimiento de ensayos clínicos; vinculación con laboratorios farmacéuticos; cumplimiento ético y regulatorio.",
      
    },
    {
      desc: "Capacitación técnica y normativa para potenciar equipos de trabajo. Optimización de recursos y procesos administrativos.",
      
    },
    {
      desc: "Gestión de proyectos de mejora continua, adaptada a cada necesidad.",
      
    },
    {
      desc: "Interpretación de normativas sanitarias y apoyo en cumplimiento regulatorio.",
     
    },
    { desc: "En TS Bio Consulting nos enfocamos en convertir la complejidad en procesos claros, eficientes y alineados con los más altos estándares, siempre orientados a los objetivos empresariales.",
      
    },

          ].map((servicio, i) => (
            <div key={i} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(125, 106, 94, 0.1)',
              transition: 'transform 0.3s ease'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#7D6A5E',
                marginBottom: '0.75rem'
              }}>
                {servicio.title}
              </h3>
              <p style={{
                color: '#B8A89D',
                fontSize: '1rem'
              }}>
                {servicio.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Servicios;