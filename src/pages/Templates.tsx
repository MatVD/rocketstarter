import React from 'react';
import { motion } from 'framer-motion';
import { BookTemplate as FileTemplate } from 'lucide-react';
import TemplateCard from '../components/Templates/TemplateCard';
import { templates } from '../data/mockData';

export default function Templates() {
  const handleLaunchTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    alert(`Lancement du template "${template?.title}" - Fonctionnalité à implémenter`);
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
          <div className="p-2 bg-purple-100 rounded-lg">
            <FileTemplate className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Templates Web3</h1>
            <p className="text-gray-600">Choisissez un template pour démarrer rapidement votre projet</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <TemplateCard
              template={template}
              onLaunch={handleLaunchTemplate}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Besoin d'un template personnalisé ?</h3>
        <p className="text-gray-600 mb-6">
          Notre équipe peut créer un template sur mesure adapté à vos besoins spécifiques. 
          Contactez-nous pour discuter de votre projet.
        </p>
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Demander un template personnalisé
        </motion.button>
      </motion.div>
    </div>
  );
}