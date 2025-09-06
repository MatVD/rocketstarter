import { motion } from "framer-motion";
import { BookTemplate as FileTemplate } from "lucide-react";
import TemplateCard from "../components/Templates/TemplateCard";
import { templates } from "../data/mockData";

export default function Templates() {
  const handleLaunchTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    alert(
      `Lancement du template "${template?.title}" - Fonctionnalité à implémenter`
    );
  };

  return (
    <div className="p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <FileTemplate className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Web3 Templates
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Pick a template to quickly start your project
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <TemplateCard template={template} onLaunch={handleLaunchTemplate} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Need a custom template?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Our team can build a custom template tailored to your specific needs.
          Contact us to discuss your project.
        </p>
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-700 dark:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white rounded-lg transition-all duration-200 font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Request a custom template
        </motion.button>
      </motion.div>
    </div>
  );
}
