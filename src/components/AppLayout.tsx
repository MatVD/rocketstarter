import { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Toast from "../components/UI/Toast";
import { useAuth } from "../hooks/useAuth";
import { updateUser } from "../api/users";
import { useUserStore } from "../store/user.store";


export function AppLayout() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { user } = useAuth();
  const { setUser } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );

  const handleRoleSwitch = useCallback(async () => {
    if (!user || !address) return;

    const newRole = user.role === "Owner" ? "Builder" : "Owner";
    const updatedUser = await updateUser(address, { role: newRole });

    setUser(updatedUser);
    setToast({
      message: `Switched to ${newRole} role`,
      type: "success",
    });

    // Redirection selon le rôle
    navigate(newRole === "Builder" ? "/projects" : "/dashboard");
  }, [user, address, navigate, setUser]);

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

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as "success" | "error" | "info" | "warning"}
          isVisible={true}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
