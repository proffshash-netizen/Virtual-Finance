import { Navigate, useLocation } from 'react-router-dom';
import { useGameState } from '../../lib/gameState';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoadingAuth } = useGameState();
  const location = useLocation();

  if (isLoadingAuth) {
    // Render a minimal loader or nothing to prevent flashing login page
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect them to the home page and trigger the login modal
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  return <>{children}</>;
}
