import { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useThemeStore } from './stores/useThemeStore';
import Layout from './components/Layout';
import { AuthGuard } from './components/auth/AuthGuard';
import { lazy } from 'react';

// Lazy loading das páginas
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/Clients'));
const Processes = lazy(() => import('./pages/Processes'));
const Documents = lazy(() => import('./pages/Documents'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Financial = lazy(() => import('./pages/Financial'));
const Settings = lazy(() => import('./pages/Settings'));
const UserRegistration = lazy(() => import('./pages/UserRegistration'));
const INSSCalculator = lazy(() => import('./pages/INSSCalculator'));
const AposentadoriaCalculator = lazy(() => import('./pages/AposentadoriaCalculator'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Suspense fallback={<LoadingSpinner />}>
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
            <Route path="INSSCalculator" element={<INSSCalculator />} />
            <Route path="AposentadoriaCalculator" element={<AposentadoriaCalculator />} />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;