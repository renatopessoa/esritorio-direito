import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { CasesPage } from '../pages/cases/CasesPage';
import { RegisterForm } from '../components/auth/RegisterForm'; // Import RegisterForm
import { NewCasePage } from '../pages/cases/NewCasePage';
import { ClientsPage } from '../pages/clients/ClientsPage';
import { NewClientPage } from '../pages/clients/NewClientPage';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={<ProtectedRoute><Navigate to="/cases" replace /></ProtectedRoute>} />
      
      <Route path="/cases" element={
        <ProtectedRoute>
          <CasesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/cases/new" element={
        <ProtectedRoute>
          <NewCasePage />
        </ProtectedRoute>
      } />
      
      <Route path="/clients" element={
        <ProtectedRoute>
          <ClientsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/clients/new" element={
        <ProtectedRoute>
          <NewClientPage />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};