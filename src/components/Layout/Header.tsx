import { User, Menu, Sun, Moon, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";
import { User as UserType } from "../../types";
import ConnectButtonCustom from "../UI/ConnectButtonCustom";

interface HeaderProps {
  projectName: string;
  onMenuClick?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  user?: UserType;
  onRoleSwitch?: () => void;
}

export default function Header({
  projectName,
  onMenuClick,
  showBackButton = false,
  onBackClick,
  user,
  onRoleSwitch,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={onBackClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Back to Projects"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {projectName}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              Web2 → Web3 Transition
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <motion.button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </motion.button>

          <motion.button
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <User className="w-5 h-5" />
          </motion.button>

          {/* Profile Dropdown Overlay */}
          {showProfileDropdown && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowProfileDropdown(false)}
            />
          )}

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 min-w-[250px]"
            >
              {/* User Role Section - Only show if user exists */}
              {user && (
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Current Role
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === "Owner"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                    {onRoleSwitch && (
                      <button
                        onClick={onRoleSwitch}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title={`Switch to ${
                          user.role === "Owner" ? "Builder" : "Owner"
                        } role`}
                      >
                        <RefreshCw className="w-3 h-3" />
                        Switch Role
                      </button>
                    )}
                  </div>
                  {user.username && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {user.username}
                    </div>
                  )}
                </div>
              )}

              {/* Connect Button - Always show */}
              <ConnectButtonCustom />
            </motion.div>
          )}

          {/* Mobile menu button */}
          <motion.button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}