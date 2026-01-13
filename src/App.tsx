import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AllProjects from "./pages/AllProjects";
import MyProjects from "./pages/MyProjects";
import CreateProject from "./pages/CreateProject";
import OwnerProjectView from "./pages/OwnerProjectView";
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
  const { isAuthenticated } = useUserStore();

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
              <AllProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-projects"
          element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/new"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <OwnerProjectView />
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
            <Navigate to="/projects" replace />
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
