import React from 'react';
import { motion } from 'framer-motion';
import { TemplateCard } from '../components/Templates/TemplateCard';
import { templates } from '../data/mockData';

export const Templates: React.FC = () => {
  const handleLaunchTemplate = (templateId: string) => {
    console.log('Launching template:', templateId);
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Web3 Templates</h1>
          <p className="text-gray-600">Choose from our pre-built templates to kickstart your Web3 project</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onLaunch={handleLaunchTemplate}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};