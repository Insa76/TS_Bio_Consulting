import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const SobreNosotros = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">¿Quiénes somos?</h1>

          <div className="text-lg text-gray-200 leading-relaxed space-y-6">
            <p>
              Somos una empresa de consultoría especializada en salud con más de 15 años de trayectoria en Argentina. Nuestra actividad principal es brindar asesoría integral a organizaciones, tanto públicas como privadas, en aspectos relacionados con la gestión, cumplimiento y transformación digital del sector salud.
            </p>
            <p>
              Contamos con un equipo multidisciplinario compuesto por médicos, administradores, ingenieros sanitarios y expertos en inteligencia artificial, lo que nos permite ofrecer soluciones técnicas, prácticas y alineadas con la realidad argentina.
            </p>
            <p>
              Nuestros clientes incluyen clínicas privadas, laboratorios farmacéuticos, prestadores de salud, entes estatales y empresas tecnológicas que buscan innovar en salud.
            </p>
            <p className="font-semibold text-blue-700">
              No solo ayudamos a cumplir normas… ayudamos a construir organizaciones sanas, sostenibles y resilientes.
            </p>
          </div>
        </div>
      </section>

  
    </div>
  );
};

export default SobreNosotros;