import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { useUser } from "./contexts/UserContext";
import {  AnimatePresence } from "framer-motion";
import { useConnect, useAccount } from "wagmi";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./pages/Dashboard";
import Build from "./pages/Build";
import ProjectList from "./pages/ProjectList";
import BuilderProjectView from "./pages/BuilderProjectView";
import Toast from "./components/UI/Toast";
import { User, Project } from "./types";
import { useProjects } from "./hooks/useProjects";
import Onboarding from "./pages/Onboarding";
import { getUserByAddress, updateUser } from "./api/users";

function AppContent() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects } = useProjects();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Web3 hooks
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { user, setUser, onboardingComplete, setOnboardingComplete } = useUser();
  
  // Use ref to track if user check is in progress
  const userCheckInProgress = useRef(false);

  // On wallet connect, check if user exists in backend
  useEffect(() => {
    let isMounted = true;
    
    const checkUser = async () => {
      // Skip if already checking or if we already have this user
      if (userCheckInProgress.current || (user && user.address === address)) {
        return;
      }
      
      if (!address) {
        if (isMounted) {
          setUser(undefined);
          setOnboardingComplete(false);
        }
        return;
      }
      
      userCheckInProgress.current = true;
      
      try {
        const fetchedUser = await getUserByAddress(address);
        if (isMounted) {
          setUser({ ...fetchedUser, address });
          setOnboardingComplete(true);
        }
      } catch {
        // User not found, show onboarding
        if (isMounted) {
          setUser(undefined);
        }
      } finally {
        userCheckInProgress.current = false;
      }
    };
    
    if (isConnected && address) {
      checkUser();
    } else if (!isConnected && isMounted) {
      setUser(undefined);
      setOnboardingComplete(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [isConnected, address]); // Only depend on connection state and address

  const handleConnectWallet = useCallback(() => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  }, [connectors, connect]);

  const handleProjectSelect = useCallback((projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      // For builders, go directly to project tasks view; for owners, go to build section
      if (user?.role === "Builder") {
        navigate(`/builder/project/${projectId}`);
      } else {
        navigate(`/build/${projectId}`);
      }
    }
  }, [projects, user?.role, navigate]);

  const handleBackToProjects = useCallback(() => {
    setSelectedProject(null);
    navigate("/projects");
  }, [navigate]);

  const handleRoleSwitch = useCallback(async () => {
    if (!user || !address) return;
    const newRole = user.role === "Owner" ? "Builder" : "Owner";
    const updatedUser = await updateUser(address, { role: newRole });
    setUser(updatedUser);
    setSelectedProject(null);
    setToastMessage(
      `Switched to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} role`
    );
    setShowToast(true);
    // Navigate based on new role
    navigate(newRole === "Builder" ? "/projects" : "/dashboard");
  }, [user, address, navigate, setUser]);

  const handleNavigateToStep = useCallback((stepId: number) => {
    if (selectedProject) {
      navigate(`/build/${selectedProject.id}?step=${stepId}`);
    }
  }, [selectedProject, navigate]);

  // Protected Route Component - memoized
  const ProtectedRoute = useMemo(() => {
    return ({ children }: { children: React.ReactNode }) => {
      if (!isConnected || (isConnected && !onboardingComplete)) {
        return <Navigate to="/onboarding" replace />;
      }
      return <>{children}</>;
    };
  }, [isConnected, onboardingComplete]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex">
        <Sidebar user={user} />
      </div>

      {/* Sidebar Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex">
            <Sidebar
              onClose={() => setIsMobileMenuOpen(false)}
              user={user}
            />
            <div
              className="flex-1"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          projectName={selectedProject?.name || "Builder Dashboard"}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          showBackButton={!!selectedProject}
          onBackClick={handleBackToProjects}
          user={user ? user : ({} as User)}
          onRoleSwitch={handleRoleSwitch}
        />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Onboarding Route - Accessible to everyone */}
              <Route 
                path="/onboarding" 
                element={<Onboarding />} 
              />

              {/* Protected Routes */}
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectList
                      projects={projects}
                      onProjectSelect={handleProjectSelect}
                      onConnectWallet={handleConnectWallet}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard onNavigateToStep={handleNavigateToStep} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/build/:projectId"
                element={
                  <ProtectedRoute>
                    <BuildRoute
                      projects={projects}
                      setSelectedProject={setSelectedProject}
                      selectedProject={selectedProject}
                      onBackToProjects={handleBackToProjects}
                      user={user}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/builder/project/:projectId"
                element={
                  <ProtectedRoute>
                    <BuilderProjectRoute
                      projects={projects}
                      setSelectedProject={setSelectedProject}
                      selectedProject={selectedProject}
                      onBackToProjects={handleBackToProjects}
                      user={user}
                    />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route
                path="/"
                element={
                  isConnected && onboardingComplete ? (
                    <Navigate to={user?.role === "Builder" ? "/projects" : "/dashboard"} replace />
                  ) : (
                    <Navigate to="/onboarding" replace />
                  )
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          isVisible={true}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

// Route Components - Memoized to prevent unnecessary re-renders
const BuildRoute = memo(({
  projects,
  setSelectedProject,
  selectedProject,
  onBackToProjects,
  user,
}: {
  projects: Project[];
  setSelectedProject: (project: Project | null) => void;
  selectedProject: Project | null;
  onBackToProjects: () => void;
  user: User | undefined;
}) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeStepId, setActiveStepId] = useState<number | null>(null);

  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === parseInt(projectId));
      if (project) {
        setSelectedProject(project);
      } else {
        navigate("/projects");
      }
    }
  }, [projectId, projects, setSelectedProject, navigate]);

  // Get step from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step");
    if (stepParam) {
      setActiveStepId(parseInt(stepParam));
    }
  }, []);

  if (!selectedProject) {
    return <div>Loading...</div>;
  }

  return (
    <Build
      activeStepId={activeStepId}
      onStepChange={setActiveStepId}
      project={selectedProject}
      onBackToProjects={onBackToProjects}
      user={user}
    />
  );
});

BuildRoute.displayName = 'BuildRoute';

const BuilderProjectRoute = memo(({
  projects,
  setSelectedProject,
  selectedProject,
  onBackToProjects,
  user,
}: {
  projects: Project[];
  setSelectedProject: (project: Project | null) => void;
  selectedProject: Project | null;
  onBackToProjects: () => void;
  user: User | undefined;
}) => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === parseInt(projectId));
      if (project) {
        setSelectedProject(project);
      } else {
        navigate("/projects");
      }
    }
  }, [projectId, projects, setSelectedProject, navigate]);

  if (!selectedProject || !user) {
    return <div>Loading...</div>;
  }

  return (
    <BuilderProjectView
      project={selectedProject}
      onBackToProjects={onBackToProjects}
      user={user}
    />
  );
});

BuilderProjectRoute.displayName = 'BuilderProjectRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}