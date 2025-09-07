import { Bell, Menu, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface HeaderProps {
  projectName: string;
  onMenuClick?: () => void;
}

export default function Header({ projectName, onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <motion.button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>

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
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="bg-[#2463eb] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
                          >
                            Connect Wallet
                          </button>
                        );
                      }
                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-colors"
                          >
                            Wrong network
                          </button>
                        );
                      }
                      return (
                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="bg-[#2463eb] text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
                        >
                          {account.displayName}
                        </button>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </header>
  );
}
