import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ProjectList from "./pages/ProjectList";
import OwnerProjectView from "./pages/OwnerProjectView";
import BuilderProjectView from "./pages/BuilderProjectView";
import Profile from "./pages/Profile";
import { AppLayout } from "./components/AppLayout";
import { useAuth } from "./hooks/useAuth";
import { useUserStore } from "./store/user.store";
import { ProtectedRoute } from "./components/ProtectedRoute";


function AuthGate({ children }: { children: React.ReactNode }) {
  const { userLoading } = useUserStore();
  if (userLoading) return null; // Ou un loader si tu veux
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useUserStore();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/projects/:projectId"
          element={
            <ProtectedRoute>
              <OwnerProjectView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder/projects/:projectId"
          element={
            <ProtectedRoute>
              <BuilderProjectView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to={user?.role === "Builder" ? "/projects" : "/dashboard"}
              replace
            />
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}



// Ce composant déclenche le flow d'authentification une seule fois
function AuthEffect() {
  useAuth();
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthEffect />
      <AuthGate>
        <AppRoutes />
      </AuthGate>
    </BrowserRouter>
  );
}
