import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookTemplate as FileTemplate,
  Hammer,
  Settings,
  ChevronRight,
  X,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose?: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "build", label: "Build", icon: Hammer },
  { id: "templates", label: "Pre-Build", icon: FileTemplate },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  onClose,
}: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            RocketStarter.io
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            By Kudora
          </p>
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
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <motion.button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" />
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Connect Wallet Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
                        className="w-full bg-[#2463eb] text-white font-semibold px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors"
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
                        className="w-full bg-red-500 text-white font-semibold px-4 py-3 rounded-lg shadow hover:bg-red-600 transition-colors"
                      >
                        Wrong network
                      </button>
                    );
                  }
                  return (
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="w-full bg-[#2463eb] text-white font-semibold px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors"
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
  );
}
