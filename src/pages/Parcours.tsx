import React from 'react';
import { motion } from 'framer-motion';
import { Route } from 'lucide-react';
import FlowStep from '../components/Parcours/FlowStep';
import { flowSteps } from '../data/mockData';

export default function Parcours() {
  const handleStepDetails = (stepId: string) => {
    alert(`Détails de l'étape ${stepId} - Fonctionnalité à implémenter`);
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Route className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parcours de transition</h1>
            <p className="text-gray-600">Visualisez votre progression étape par étape</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-gray-50 rounded-xl p-8 overflow-x-auto">
        <div className="flex items-center space-x-0 min-w-max">
          {flowSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FlowStep
                step={step}
                isLast={index === flowSteps.length - 1}
                onDetails={handleStepDetails}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Étape actuelle : Smart contracts</h3>
        <p className="text-blue-700 mb-4">
          Vous êtes en train de développer les smart contracts pour votre projet. 
          Cette étape inclut la création, les tests et l'optimisation de vos contrats.
        </p>
        <div className="flex space-x-3">
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continuer l'étape
          </motion.button>
          <motion.button
            className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Voir la documentation
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}