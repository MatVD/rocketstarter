import { useState, useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import { updateUser } from "../api/users";
import { useUserStore } from "../store/user.store";
import { useProjectStore } from "../store/project.store";
import { useTaskStore } from "../store/task.store";
import { useToast } from "../contexts/ToastContext";

export function AppLayout() {
  const { address } = useAccount();
  const { user, fetchUsers } = useUserStore();
  const { setUser } = useUserStore();
  const { showSuccess } = useToast();
  const { fetchProjects } = useProjectStore();
  const { fetchTasks } = useTaskStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 🚀 GLOBAL DATA LOADING: Load all data once when user is authenticated
  // This ensures data is available across all pages without repeated fetches
  useEffect(() => {
    if (user?.address) {
      // Load all projects (not filtered by owner)
      fetchProjects();
      
      // Load all tasks (not filtered by project)
      fetchTasks();
      
      // Load all users for task assignment display
      fetchUsers();
    }
  }, [user?.address, fetchProjects, fetchTasks, fetchUsers]);

  const handleRoleSwitch = useCallback(async () => {
    if (!user || !address) return;

    const newRole = user.role === "Owner" ? "Builder" : "Owner";
    const updatedUser = await updateUser(address, { role: newRole });

    setUser(updatedUser);
    showSuccess(`Switched to ${newRole} role`);

    // No navigation needed - pages will automatically update based on new role
  }, [user, address, setUser, showSuccess]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex">
        <Sidebar user={user} />
      </div>

      {/* Sidebar Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex">
            <Sidebar onClose={() => setIsMobileMenuOpen(false)} user={user} />
            <div
              className="flex-1"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setIsMobileMenuOpen(true)}
          user={user}
          onRoleSwitch={handleRoleSwitch}
        />

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
