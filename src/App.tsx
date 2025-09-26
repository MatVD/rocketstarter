import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConnect, useAccount } from "wagmi";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./pages/Dashboard";
import Build from "./pages/Build";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import ProjectList from "./pages/ProjectList";
import BuilderProjectView from "./pages/BuilderProjectView";
import MyTasks from "./pages/MyTasks";
import Toast from "./components/UI/Toast";
import { mockProjects, mockUser } from "./data/mockData";
import { User, Project } from "./types";

function App() {
  const [activeTab, setActiveTab] = useState("projects");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(mockUser);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects] = useState<Project[]>(mockProjects);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Web3 hooks
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  // Sync wallet connection with user state
  useEffect(() => {
    setCurrentUser((prev) => ({
      ...prev,
      isConnected,
      address: address || undefined,
    }));
  }, [isConnected, address]);

  const onSettingsClick = () => {
    setActiveTab("settings");
  };

  const handleConnectWallet = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      // For builders, go directly to project tasks view; for owners, go to build section
      setActiveTab(
        currentUser.role === "builder" ? "builder-project" : "build"
      );
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setActiveTab("projects");
    setActiveStepId(null);
  };

  const handleRoleSwitch = () => {
    const newRole = currentUser.role === "owner" ? "builder" : "owner";
    setCurrentUser((prev) => ({
      ...prev,
      role: newRole,
    }));
    // Reset to appropriate starting view for the new role
    setSelectedProject(null);
    setActiveStepId(null);
    setActiveTab(newRole === "builder" ? "projects" : "dashboard");

    // Show toast notification
    setToastMessage(
      `Switched to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} role`
    );
    setShowToast(true);
  };

  const handleNavigateToStep = (stepId: string) => {
    setActiveStepId(stepId);
    setActiveTab("build");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <ProjectList
            projects={projects}
            user={currentUser}
            onProjectSelect={handleProjectSelect}
            onConnectWallet={handleConnectWallet}
          />
        );
      case "dashboard":
        return <Dashboard onNavigateToStep={handleNavigateToStep} />;
      case "build":
        // For builders, auto-select first project if none is selected
        if (
          !selectedProject &&
          currentUser.role === "builder" &&
          projects.length > 0
        ) {
          const firstProject = projects[0];
          setSelectedProject(firstProject);
          return (
            <Build
              activeStepId={activeStepId}
              onStepChange={setActiveStepId}
              onSettingsClick={onSettingsClick}
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
            onSettingsClick={onSettingsClick}
            project={selectedProject}
            onBackToProjects={handleBackToProjects}
            user={currentUser}
          />
        ) : (
          <ProjectList
            projects={projects}
            user={currentUser}
            onProjectSelect={handleProjectSelect}
            onConnectWallet={handleConnectWallet}
          />
        );
      case "my-tasks":
        return <MyTasks user={currentUser} />;
      case "builder-project":
        return selectedProject ? (
          <BuilderProjectView
            project={selectedProject}
            onBackToProjects={handleBackToProjects}
            user={currentUser}
          />
        ) : (
          <ProjectList
            projects={projects}
            user={currentUser}
            onProjectSelect={handleProjectSelect}
            onConnectWallet={handleConnectWallet}
          />
        );
      case "templates":
        return <Templates />;
      case "settings":
        return <Settings />;
      default:
        return (
          <ProjectList
            projects={projects}
            user={currentUser}
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
          user={currentUser}
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
