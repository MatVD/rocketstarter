import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ProjectList from "./pages/ProjectList";
import OwnerProjectView from "./pages/OwnerProjectView";
import BuilderProjectView from "./pages/BuilderProjectView";
import { AppLayout } from "./components/AppLayout";
import { useAuth } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

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
          path="/build/:projectId"
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

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
