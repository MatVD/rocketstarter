import { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import { useAuth } from "../hooks/useAuth";
import { updateUser } from "../api/users";
import { useUserStore } from "../store/user.store";
import { useToast } from "../contexts/ToastContext";

export function AppLayout() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { user } = useAuth();
  const { setUser } = useUserStore();
  const { showSuccess } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleRoleSwitch = useCallback(async () => {
    if (!user || !address) return;

    const newRole = user.role === "Owner" ? "Builder" : "Owner";
    const updatedUser = await updateUser(address, { role: newRole });

    setUser(updatedUser);
    showSuccess(`Switched to ${newRole} role`);

    // Redirection selon le rôle
    navigate(newRole === "Builder" ? "/projects" : "/dashboard");
  }, [user, address, navigate, setUser, showSuccess]);

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
