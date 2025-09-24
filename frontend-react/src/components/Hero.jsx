import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Transformamos la salud en Argentina
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Asesoría médica con inteligencia artificial para clínicas, hospitales y laboratorios.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/servicios" className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Conozca nuestros servicios
          </Link>
          <Link to="/contacto" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition">
            Solicite una consulta
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;