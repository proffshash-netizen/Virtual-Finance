import { Navigate, useLocation } from 'react-router-dom';
import { useGameState } from '../../lib/gameState';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useGameState();
  const location = useLocation();

  if (!user) {
    // Redirect them to the home page and trigger the login modal
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  return <>{children}</>;
}
