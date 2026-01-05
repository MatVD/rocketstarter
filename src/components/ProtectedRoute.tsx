import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Composant guard pour protéger les routes authentifiées
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, authLoading } = useAuth();

  // If auth is still initializing (checking cookie / verifying), don't
  // redirect immediately — render nothing (or a loader) so the auth
  // flow can complete. This prevents a quick redirect to onboarding
  // when visiting protected routes on page load.
  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}