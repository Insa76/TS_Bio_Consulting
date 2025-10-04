// src/pages/SobreNosotros.jsx
import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const SobreNosotros = () => {
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
        maxWidth: '1200px',
        margin: '0 auto',
        lineHeight: '1.8'
      }}>
        {/* Título */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '600',
          color: '#7D6A5E',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          ¿Quiénes Somos?
        </h1>

        {/* Sección de imagen + texto */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '3rem',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}>
          
          {/* Imagen a la izquierda */}
          <div style={{
            flex: '1 1 300px',
            minWidth: '280px'
          }}>
            <img
              src="/images/portadats.jpg" // Asegúrate de tener la imagen en public/images/
              alt="Tania - TS Bio Consulting"
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}
            />
          </div>

          {/* Texto a la derecha */}
          <div style={{
            flex: '2 1 500px',
            color: '#B8A89D',
            fontSize: '1.125rem'
          }}>
            <p style={{ marginBottom: '1.5rem' }}>
              TS Bio Consulting es una firma de consultoría científica,
              estratégica y humana, especializada en calidad en salud y
              ciencias de la vida. Integra la excelencia técnica con una mirada
              práctica, empática y actualizada, para convertir desafíos
              complejos en soluciones accionables, claras y sostenibles.
            </p>

            <p style={{ marginBottom: '1.5rem' }}>
              Más que una consultora, es un puente entre el conocimiento
              científico y la toma de decisiones. Trabaja con instituciones,
              equipos y profesionales que buscan crecer, mejorar sus procesos
              y cumplir con normativas, pero también generar un impacto
              positivo y consciente en su entorno.
            </p>

            <div style={{
              marginTop: '2.5rem',
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(125, 106, 94, 0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#7D6A5E',
                marginBottom: '1rem'
              }}>
                Nuestra Misión
              </h2>
              <p style={{ color: '#B8A89D' }}>
                Acompañar a profesionales, equipos e instituciones del ámbito de
                la salud y las ciencias de la vida en la implementación,
                optimización y sostenimiento de sistemas de gestión de calidad.
                A través de un enfoque integral que combina asesoría estratégica,
                capacitación técnica y soluciones personalizadas, adaptadas a
                las particularidades de cada contexto.
                Fundamentado en el rigor científico, el compromiso con la mejora
                continua y una profunda empatía por los desafíos reales que
                enfrentan quienes trabajan en entornos sanitarios y científicos.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SobreNosotros;