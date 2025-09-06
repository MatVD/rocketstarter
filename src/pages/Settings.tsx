import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import Card from '../components/UI/Card';
import { mockProject } from '../data/mockData';

export default function Settings() {
  const [projectName, setProjectName] = useState(mockProject.name);
  const [environment, setEnvironment] = useState(mockProject.environment);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600">Configurez votre projet Web3</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuration du projet</h3>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du projet
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Entrez le nom de votre projet"
              />
            </div>

            <div>
              <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-2">
                Environnement
              </label>
              <select
                id="environment"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as 'testnet' | 'mainnet')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="testnet">Testnet (Développement)</option>
                <option value="mainnet">Mainnet (Production)</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                {environment === 'testnet' 
                  ? 'Utilisez le testnet pour développer et tester sans frais réels'
                  : 'Le mainnet utilise de vraies cryptomonnaies - soyez prudent'
                }
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <motion.button
                onClick={handleSave}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  saved 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-4 h-4" />
                <span>{saved ? 'Sauvegardé !' : 'Enregistrer'}</span>
              </motion.button>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6"
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du projet</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Statut :</span>
              <span className="ml-2 font-medium text-gray-900">En développement</span>
            </div>
            <div>
              <span className="text-gray-500">Blockchain :</span>
              <span className="ml-2 font-medium text-gray-900">Ethereum</span>
            </div>
            <div>
              <span className="text-gray-500">Version :</span>
              <span className="ml-2 font-medium text-gray-900">1.0.0</span>
            </div>
            <div>
              <span className="text-gray-500">Créé le :</span>
              <span className="ml-2 font-medium text-gray-900">15 Jan 2025</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}