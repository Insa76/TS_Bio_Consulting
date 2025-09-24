import React from 'react';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Bienvenido, Dr. 👋</h2>
            <p className="text-lg text-gray-600 mb-8">
              Su clínica está a punto de mejorar su cumplimiento sanitario con inteligencia artificial.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-blue-600">3</div>
                <div className="text-gray-600">Auditorías completadas</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">92%</div>
                <div className="text-gray-600">Cumplimiento promedio</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-orange-600">2</div>
                <div className="text-gray-600">Informe pendientes</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Acciones recomendadas</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Complete su autoevaluación para generar su primer informe</li>
                <li>• Revise el manual de gestión de residuos médicos</li>
                <li>• Configure su comité de bioética</li>
              </ul>
              <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Iniciar Autoevaluación
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;