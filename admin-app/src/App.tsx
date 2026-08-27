import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './lib/auth';
import { AdminLayout } from './components/AdminLayout';
import { AdminLogin } from './pages/AdminLogin';
import { Dashboard } from './pages/Dashboard';
import { PlayerManagement } from './pages/PlayerManagement';
import { PlayerControlPanel } from './pages/PlayerControlPanel';
import { AuditLogs } from './pages/AuditLogs';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAdminAuth();
  
  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center bg-background text-primary animate-pulse font-mono tracking-widest text-xl">INITIALIZING FINLIT CORE...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/players" element={<PlayerManagement />} />
            <Route path="/players/:id" element={<PlayerControlPanel />} />
            <Route path="/audit" element={<AuditLogs />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

export default App;
