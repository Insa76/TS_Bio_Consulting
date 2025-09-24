// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Contextos
import { AuthProvider, AuthContext } from './context/AuthContext';

// Componentes
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuditPage from './pages/AuditPage';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ReportViewer from './components/AI/ReportViewer';
import Home from './pages/Home';
import Servicios from './pages/Servicios';
import SobreNosotros from './pages/SobreNosotros';
import Contacto from './pages/Contacto';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


// Ruta privada
const PrivateRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Login />;
  return children;
};

// Ruta solo para admins
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = React.useContext(AuthContext);
  if (!user) return <Login />;
  if (!isAdmin) return <Dashboard />;
  return children;
};

function App() {
  const { user, isAdmin } = React.useContext(AuthContext) || {};

  return (
    <AuthProvider>
      <Router>
        <div style={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: '#F5E9DC',
          fontFamily: 'Inter, sans-serif',
          color: '#7D6A5E'
        }}>
          
          {/* Sidebar: Solo visible para admins */}
          {isAdmin && <Sidebar />}

          {/* Contenido principal */}
          <main style={{
            marginLeft: isAdmin ? '256px' : '0',
            width: isAdmin ? 'calc(100% - 256px)' : '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundImage: 'url(/images/bg1.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            
          }}>
            
            {/* Header: Siempre visible */}
            <Header />

            {/* Área de contenido */}
            <div style={{
              marginTop: '60px',
              flexGrow: 1,
              //backgroundColor: '#ffffff2a',
              //backgroundImage: 'url(/images/bg1.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}>
              <Routes>
                {/* Páginas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Rutas protegidas */}
                <Route path="/dashboard" element={
                  <PrivateRoute><Dashboard /></PrivateRoute>
                }/>
                <Route path="/audit" element={
                  <PrivateRoute><AuditPage /></PrivateRoute>
                }/>

                {/* Rutas solo para admins */}
                <Route path="/reports" element={
                  <AdminRoute><Reports /></AdminRoute>
                }/>
                <Route path="/settings" element={
                  <AdminRoute><Settings /></AdminRoute>
                }/>
                <Route path="/report/:id" element={
                  <AdminRoute><ReportViewer /></AdminRoute>
                }/>
              </Routes>
            </div>

            <Footer />
            
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;