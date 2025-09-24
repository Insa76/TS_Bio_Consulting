import React from 'react';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';

const Settings = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Configuración</h1>

          <div className="bg-white p-8 rounded-lg shadow space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Perfil</h2>
              <p><strong>Nombre:</strong> Dr. Ana López</p>
              <p><strong>Email:</strong> ana@clinicalab.com.ar</p>
              <p><strong>Organización:</strong> Clínica Medilife</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Notificaciones</h2>
              <label className="flex items-center mb-3">
                <input type="checkbox" className="mr-2" defaultChecked />
                Recibir alertas de incumplimiento
              </label>
              <label className="flex items-center mb-3">
                <input type="checkbox" className="mr-2" defaultChecked />
                Recibir nuevos manuales
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Recibir boletín mensual
              </label>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Seguridad</h2>
              <button className="text-blue-600 hover:text-blue-800">Cambiar contraseña</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;