import React from 'react';
import Header from '../components/Layout/Header';

const Servicios = () => {
  const servicios = [
    {
      description: "Diagnóstico y asesoramiento en sistemas de gestión de calidad (ISO 9001, ISO 15189, entre otros).",
      
    },
    {
      description: "Implementación de buenas prácticas en laboratorios, clínicas e instituciones de salud.",
      
    },
    {
      description: "Apoyo en diseño, gestión y cumplimiento de ensayos clínicos; vinculación con laboratorios farmacéuticos; cumplimiento ético y regulatorio.",
      
    },
    {
      description: "Capacitación técnica y normativa para potenciar equipos de trabajo. Optimización de recursos y procesos administrativos.",
      
    },
    {
      description: "Gestión de proyectos de mejora continua, adaptada a cada necesidad.",
      
    },
    {
      description: "Interpretación de normativas sanitarias y apoyo en cumplimiento regulatorio.",
     
    },
    { description: "En TS Bio Consulting nos enfocamos en convertir la complejidad en procesos claros, eficientes y alineados con los más altos estándares, siempre orientados a los objetivos empresariales.",
      
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Nuestros Servicios</h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            Ofrecemos una amplia cartera de soluciones orientadas a resolver los problemas y detectar las oportunidades de mejora de cada uno de nuestros clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {servicios.map((servicio, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-4xl mb-4">{servicio.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{servicio.title}</h3>
              <p className="text-gray-600 leading-relaxed">{servicio.description}</p>
            </div>
          ))}
        </div>
      </section>

      
    </div>
  );
};

export default Servicios;