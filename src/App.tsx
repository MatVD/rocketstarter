import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ProjectList from "./pages/ProjectList";
import Build from "./pages/Build";
import BuilderProjectView from "./pages/BuilderProjectView";
import { AppLayout } from "./components/AppLayout";
import { useAuth } from "./hooks/useAuth";

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/projects" element={<ProjectList />} />
        <Route path="/build/:projectId" element={<Build />} />
        <Route
          path="/builder/project/:projectId"
          element={<BuilderProjectView />}
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
