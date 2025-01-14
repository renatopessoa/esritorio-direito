import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useThemeStore } from './stores/useThemeStore';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Processes from './pages/Processes';
import Documents from './pages/Documents';
import Calendar from './pages/Calendar';
import Financial from './pages/Financial';
import Settings from './pages/Settings';
import UserRegistration from './pages/UserRegistration';
import { AuthGuard } from './components/auth/AuthGuard';

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/app"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="processes" element={<Processes />} />
          <Route path="documents" element={<Documents />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="financial" element={<Financial />} />
          <Route path="user-registration" element={<UserRegistration />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;