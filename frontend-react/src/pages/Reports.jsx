import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import { auditService } from '../services/api';
import ReportViewer from '../components/AI/ReportViewer';

const Reports = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await auditService.getAll();
        setAudits(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64">
          <Header />
          <main className="flex-1 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto my-16"></div>
            <p>Cargando sus informes...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Informes</h1>

          {audits.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Aún no ha completado ninguna autoevaluación.</p>
              <button
                onClick={() => window.location.href = '/audit'}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Iniciar evaluación
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {audits.map((audit) => (
                <div key={audit.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">
                        Informe #{audit.id} - {new Date(audit.created_at).toLocaleDateString()}
                      </h3>
                      <p className="text-gray-600">Puntaje: {audit.score}%</p>
                    </div>
                    <button
                      onClick={() => window.open(`/report/${audit.id}`, '_blank')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Ver informe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;