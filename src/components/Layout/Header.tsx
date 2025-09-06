import React from "react";
import { Bell, User, Menu } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  projectName: string;
  onMenuClick?: () => void;
}

export default function Header({ projectName, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Bouton menu mobile */}
          <motion.button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {projectName}
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              Plateforme de transition Web2 → Web3
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <motion.button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
          </motion.button>

          <motion.div
            className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Utilisateur</p>
              <p className="text-gray-500">Admin</p>
            </div>
          </motion.div>

          {/* Version mobile du profil utilisateur */}
          <motion.div
            className="md:hidden w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
