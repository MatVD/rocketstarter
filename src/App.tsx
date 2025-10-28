import { useState, useEffect } from "react";
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
import { getUserByAddress } from "./api/users";

function App() {
  const [activeTab, setActiveTab] = useState("projects");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeStepId, setActiveStepId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects } = useProjects();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);

  // Web3 hooks
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  // On wallet connect, check if user exists in backend
  useEffect(() => {
    const checkUser = async () => {
      if (!address) {
        setCurrentUser(undefined);
        setCheckingUser(false);
        return;
      }
      setCheckingUser(true);
      try {
        const user = await getUserByAddress(address);
        setCurrentUser({ ...user, address });
        setOnboardingComplete(true);
      } catch {
        // User not found, show onboarding
        setCurrentUser(undefined);
        setOnboardingComplete(false);
      } finally {
        setCheckingUser(false);
      }
    };
    if (isConnected && address) {
      checkUser();
    } else {
      setCurrentUser({} as User);
      setOnboardingComplete(false);
      setCheckingUser(false);
    }
  }, [isConnected, address]);

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
      setActiveTab(
        currentUser?.role === "builder" ? "builder-project" : "build"
      );
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setActiveTab("projects");
    setActiveStepId(null);
  };

  const handleRoleSwitch = () => {
    if (!currentUser) return;
    const newRole = currentUser.role === "owner" ? "builder" : "owner";
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            role: newRole,
          }
        : undefined
    );
    setSelectedProject(null);
    setActiveStepId(null);
    setActiveTab(newRole === "builder" ? "projects" : "dashboard");
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
    if (!checkingUser && !isConnected && !onboardingComplete) {
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
          currentUser?.role === "builder" &&
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
              user={currentUser}
            />
          );
        }
        return selectedProject ? (
          <Build
            activeStepId={activeStepId}
            onStepChange={setActiveStepId}
            project={selectedProject}
            onBackToProjects={handleBackToProjects}
            user={currentUser}
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
            user={currentUser ? currentUser : {} as User}
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
          user={currentUser}
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
              user={currentUser}
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
          user={currentUser ? currentUser : {} as User}
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

export default App;
