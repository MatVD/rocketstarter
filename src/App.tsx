import { useState, useEffect } from "react";
import { UserProvider, useUser } from "./contexts/UserContext";
import { motion, AnimatePresence } from "framer-motion";
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
  const [activeTab, setActiveTab] = useState("projects");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeStepId, setActiveStepId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects } = useProjects();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Web3 hooks
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { user, setUser, onboardingComplete, setOnboardingComplete } = useUser();

  // On wallet connect, check if user exists in backend
  useEffect(() => {
    const checkUser = async () => {
      if (!address) {
        setUser(undefined);
        return;
      }
      try {
        const fetchedUser = await getUserByAddress(address);
        setUser({ ...fetchedUser, address });
        setOnboardingComplete(true);
      } catch {
        // User not found, show onboarding
        setUser(undefined);
      }
    };
    if (isConnected && address) {
      checkUser();
    } else {
      setUser(undefined);
    }
  }, [isConnected, address, setUser, setOnboardingComplete]);

  const handleConnectWallet = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const handleProjectSelect = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      // For builders, go directly to project tasks view; for owners, go to build section
      setActiveTab(user?.role === "Builder" ? "builder-project" : "build");
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setActiveTab("projects");
    setActiveStepId(null);
  };

  const handleRoleSwitch = async () => {
    if (!user || !address) return;
    const newRole = user.role === "Owner" ? "Builder" : "Owner";
    const updatedUser = await updateUser(address, { role: newRole });
    setUser(updatedUser);
    setSelectedProject(null);
    setActiveStepId(null);
    setActiveTab(newRole === "Builder" ? "projects" : "dashboard");
    setToastMessage(
      `Switched to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} role`
    );
    setShowToast(true);
  };

  const handleNavigateToStep = (stepId: number) => {
    setActiveStepId(stepId);
    setActiveTab("build");
  };

  const renderContent = () => {
    // Show onboarding if user is not found in backend and wallet is connected
    if (!isConnected || (isConnected && !onboardingComplete)) {
      return <Onboarding />;
    }
    // If user is loaded, show the app
    switch (activeTab) {
      case "projects":
        return (
          <ProjectList
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onConnectWallet={handleConnectWallet}
          />
        );
      case "dashboard":
        return <Dashboard onNavigateToStep={handleNavigateToStep} />;
      case "build":
        if (
          !selectedProject &&
          user?.role === "Builder" &&
          projects.length > 0
        ) {
          const firstProject = projects[0];
          setSelectedProject(firstProject);
          return (
            <Build
              activeStepId={activeStepId}
              onStepChange={setActiveStepId}
              project={firstProject}
              onBackToProjects={handleBackToProjects}
              user={user}
            />
          );
        }
        return selectedProject ? (
          <Build
            activeStepId={activeStepId}
            onStepChange={setActiveStepId}
            project={selectedProject}
            onBackToProjects={handleBackToProjects}
            user={user}
          />
        ) : (
          <ProjectList
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onConnectWallet={handleConnectWallet}
          />
        );
      case "builder-project":
        return selectedProject ? (
          <BuilderProjectView
            project={selectedProject}
            onBackToProjects={handleBackToProjects}
            user={user ? user : ({} as User)}
          />
        ) : (
          <ProjectList
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onConnectWallet={handleConnectWallet}
          />
        );
      default:
        return (
          <ProjectList
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onConnectWallet={handleConnectWallet}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
        />
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
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              onClose={() => setIsMobileMenuOpen(false)}
              user={user}
            />
            {/* Click area to close - to the right of the sidebar */}
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
          showBackButton={!!selectedProject && activeTab === "build"}
          onBackClick={handleBackToProjects}
          user={user ? user : ({} as User)}
          onRoleSwitch={handleRoleSwitch}
        />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
