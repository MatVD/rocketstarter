import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Hammer,
  ChevronRight,
  X,
  FolderOpen,
  ChevronLeft,
  Rocket,
} from "lucide-react";
import { User } from "../../types";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  onClose?: () => void;
  user?: User;
}

// Centralized menu items definition
const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["Owner"],
  },
  {
    id: "build",
    label: "Build",
    icon: Hammer,
    path: "/projects",
    roles: ["Owner"],
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderOpen,
    path: "/projects",
    roles: ["Builder"],
  },
];

export default function Sidebar({ onClose, user }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Filter menu items based on user role
  const menuItems = MENU_ITEMS.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (user?.role === "Owner" && path.startsWith("/projects")) return "build";
    if (path.startsWith("/dashboard")) return "dashboard";
    if (path.startsWith("/projects")) return "projects";
    return "projects";
  };

  const activeTab = getActiveTab();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <motion.div
      animate={{ width: isExpanded ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col relative"
    >
      <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {isExpanded ? (
          <>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                RocketStarter.io
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  By Kudora
                </p>
              </div>
            </div>
            {onClose && (
              <motion.button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center p-3">
              <Rocket className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <motion.button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center ${
                    isExpanded ? "px-4" : "px-0 justify-center"
                  } py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={!isExpanded ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 ${isExpanded ? "mr-3" : ""} ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  {isExpanded && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" />
                      )}
                    </>
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom right toggle button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute bottom-4 right-[-13px] p-2 rounded-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 dark:text-white shadow-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isExpanded ? "Close sidebar" : "Open sidebar"}
      >
        {isExpanded ? (
          <ChevronLeft className="w-6 h-6" />
        ) : (
          <ChevronRight className="w-6 h-6" />
        )}
      </motion.button>
    </motion.div>
  );
}
