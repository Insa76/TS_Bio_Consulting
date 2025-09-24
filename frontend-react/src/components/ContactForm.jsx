// src/components/ContactForm.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ContactForm = () => {
  return (
    <section style={{
      padding: '4rem 1.5rem',
      backgroundColor: '#a8a39dff', // Beige claro (paleta marrón pastel)
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Título */}
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: '600',
          color: '#7D6A5E', // Marrón oscuro
          marginBottom: '1rem'
        }}>
          Envíenos su consulta
        </h2>

        {/* Descripción */}
        <p style={{
          fontSize: '1.125rem',
          color: '#B8A89D', // Gris canela
          marginBottom: '2.5rem',
          lineHeight: '1.7'
        }}>
          Estamos a disposición para atender cualquiera de sus consultas. 
          Para más información, tenga el agrado de contactarnos mediante el formulario debajo.
        </p>

        {/* Botón de contacto */}
        <Link
          to="/contacto"
          style={{
            display: 'inline-block',
            backgroundColor: '#D4B9A5', // Marrón cálido pastel
            color: '#7D6A5E',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            border: '1px solid #B8A89D'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#CAB09C';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#D4B9A5';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Contactar ahora
        </Link>
      </div>
    </section>
  );
};

export default ContactForm;