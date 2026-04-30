import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EncryptPage from './pages/EncryptPage';
import ComputePage from './pages/ComputePage';
import MPCPage from './pages/MPCPage';
import AuditPage from './pages/AuditPage';
import { RecordsPage, ResultsPage, KeysPage } from './pages/OtherPages';

function ProtectedLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-void)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg-base)' }}>
        <Outlet />
      </main>
    </div>
  );
}

function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuth();
  if (!allowedRoles.includes(user?.role)) {
    return (
      <div style={{ padding: '60px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)', marginBottom: 8 }}>
          Access Restricted
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Your role does not have permission to access this page.
        </div>
      </div>
    );
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="encrypt" element={
              <RoleGuard allowedRoles={['data_owner', 'admin']}>
                <EncryptPage />
              </RoleGuard>
            } />
            <Route path="compute" element={
              <RoleGuard allowedRoles={['research_analyst', 'admin']}>
                <ComputePage />
              </RoleGuard>
            } />
            <Route path="mpc" element={
              <RoleGuard allowedRoles={['admin']}>
                <MPCPage />
              </RoleGuard>
            } />
            <Route path="keys" element={
              <RoleGuard allowedRoles={['admin']}>
                <KeysPage />
              </RoleGuard>
            } />
            <Route path="records" element={
              <RoleGuard allowedRoles={['data_owner', 'admin']}>
                <RecordsPage />
              </RoleGuard>
            } />
            <Route path="results" element={<ResultsPage />} />
            <Route path="audit" element={
              <RoleGuard allowedRoles={['admin', 'privacy_officer']}>
                <AuditPage />
              </RoleGuard>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
