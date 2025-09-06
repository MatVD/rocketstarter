import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { mockProject } from '../data/mockData';

export const Settings: React.FC = () => {
  const [projectName, setProjectName] = useState(mockProject.name);
  const [environment, setEnvironment] = useState(mockProject.environment);

  const handleSave = () => {
    console.log('Saving settings:', { projectName, environment });
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your project settings</p>
        </div>

        <div className="max-w-2xl">
          <Card title="Project Configuration" className="p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-2">
                  Environment
                </label>
                <select
                  id="environment"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value as 'testnet' | 'mainnet')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="testnet">Testnet</option>
                  <option value="mainnet">Mainnet</option>
                </select>
              </div>

              <motion.button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </motion.button>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};