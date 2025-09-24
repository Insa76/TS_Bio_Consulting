// src/pages/Contacto.jsx
import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    organizacion: '',
    servicio: '',
    mensaje: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al enviar la consulta. Intente nuevamente.');
      }

      const data = await response.json();
      console.log(data.message); // "Consulta recibida. Nos contactaremos pronto."
      setSubmitted(true);
      setFormData({ nombre: '', email: '', organizacion: '', servicio: '', mensaje: '' });
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5E9DC',
        fontFamily: 'Inter, sans-serif'
      }}>
        <Header />
        <div style={{
          padding: '5rem 1.5rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            color: '#7D6A5E',
            marginBottom: '1rem'
          }}>
            ¡Gracias por contactarnos!
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#B8A89D',
            marginBottom: '2rem'
          }}>
            Nos pondremos en contacto contigo en menos de 24 horas.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#D4B9A5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#CAB09C'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#D4B9A5'}
          >
            Enviar otro mensaje
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5E9DC',
      fontFamily: 'Inter, sans-serif'
    }}>
      <Header />

      <section style={{
        padding: '4rem 1.5rem',
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            color: '#7D6A5E',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            Envíenos su consulta
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#B8A89D',
            textAlign: 'center',
            marginBottom: '3rem',
            lineHeight: '1.7'
          }}>
            Estamos a disposición para atender cualquiera de sus consultas. Para más información, complete el formulario a continuación.
          </p>

          {error && (
            <div style={{
              backgroundColor: '#D9A39A',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Nombre */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1rem',
                color: '#7D6A5E',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Nombre completo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ej: Dr. Juan Pérez"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #E8D6C6',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
                onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1rem',
                color: '#7D6A5E',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ejemplo@clinica.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #E8D6C6',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
                onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
              />
            </div>

            {/* Organización */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1rem',
                color: '#7D6A5E',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Organización / Clínica *
              </label>
              <input
                type="text"
                name="organizacion"
                value={formData.organizacion}
                onChange={handleChange}
                required
                placeholder="Ej: Clínica Medilife, CABA"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #E8D6C6',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
                onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
              />
            </div>

            {/* Servicio */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1rem',
                color: '#7D6A5E',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Servicio de interés *
              </label>
              <select
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #E8D6C6',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: 'white',
                  color: '#7D6A5E'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
                onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
              >
                <option value="">Seleccione una opción</option>
                <option value="Políticas de Salud">Políticas de Salud</option>
                <option value="Gestión de Calidad">Gestión de Calidad</option>
                <option value="I+D y Estudios Clínicos">I+D y Estudios Clínicos</option>
                <option value="Gestión Financiera">Gestión Financiera</option>
                <option value="Innovación y Tecnología">Innovación y Tecnología</option>
                <option value="Gestión Estratégica">Gestión Estratégica</option>
              </select>
            </div>

            {/* Mensaje */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1rem',
                color: '#7D6A5E',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                Mensaje *
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows="5"
                placeholder="¿En qué podemos ayudarle? (Ej: Quiero una auditoría de cumplimiento COFEPRIS)"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #E8D6C6',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'vertical',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D4B9A5'}
                onBlur={(e) => e.target.style.borderColor = '#E8D6C6'}
              ></textarea>
            </div>

            {/* Botón enviar */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.85rem 0',
                backgroundColor: loading ? '#B8A89D' : '#D4B9A5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#CAB09C')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#D4B9A5')}
            >
              {loading ? 'Enviando...' : 'Enviar Consulta'}
            </button>
          </form>
        </div>
      </section>

    
    </div>
  );
};

export default Contacto;