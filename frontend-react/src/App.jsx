// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import TaskNotifications from './components/TaskNotifications';
import ReportViewer from './components/AI/ReportViewer';

// Páginas
import Home from './pages/Home';
import Servicios from './pages/Servicios';
import SobreNosotros from './pages/SobreNosotros';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuditPage from './pages/AuditPage';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Tasks from './pages/Tasks';
import TeamPanel from './pages/TeamPanel';
import CreateTeam from './pages/CreateTeam';
import AssignMembers from './pages/AssignMembers';
import TeamManagement from './pages/TeamManagement';


const App = () => {
  return (
    <AuthProvider>
      <TaskNotifications />
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      backgroundImage: 'url(/images/bg1.jpeg)',
      //backgroundSize: 'contain',
      backgroundPosition: 'center',
      //backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    }}>
      {/* Sidebar: Solo visible si es admin */}
      {isAdmin && <Sidebar />}

      {/* Contenido principal */}
      <main style={{
        marginLeft: isAdmin ? '256px' : '0',
        width: isAdmin ? `calc(100% - 256px)` : '100%',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <Header />
        
        <div style={{
          marginTop: '60px',
          flexGrow: 1,
          padding: '2rem'
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/audit" element={<PrivateRoute><AuditPage /></PrivateRoute>} />
            <Route path="/reports" element={<AdminRoute><Reports /></AdminRoute>} />
            <Route path="/settings" element={<AdminRoute><Settings /></AdminRoute>} />
            <Route path="/report/:id" element={<AdminRoute><ReportViewer /></AdminRoute>} />
            <Route path="/tasks" element={<AdminRoute><Tasks /></AdminRoute>} />
            <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/team" element={<AdminRoute><TeamPanel /></AdminRoute>} />
            <Route path="/create-team" element={<AdminRoute><CreateTeam /></AdminRoute>} />
            <Route path="/assign-members" element={<AdminRoute><AssignMembers /></AdminRoute>} />
            <Route path="/teams" element={<AdminRoute><TeamManagement /></AdminRoute>} />
          </Routes>
        </div>

        <Footer />
      </main>
    </div>
  );
};

// Ruta protegida
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Solo admins
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

export default App;