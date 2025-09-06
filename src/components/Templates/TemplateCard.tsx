import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Image, Users, ArrowRight } from 'lucide-react';
import { Template } from '../../types';

interface TemplateCardProps {
  template: Template;
  onLaunch: (templateId: string) => void;
}

const getTemplateIcon = (title: string) => {
  if (title.includes('ERC-20')) return Coins;
  if (title.includes('NFT')) return Image;
  if (title.includes('DAO')) return Users;
  return Coins;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800';
    case 'Intermediate':
      return 'bg-orange-100 text-orange-800';
    case 'Advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onLaunch }) => {
  const Icon = getTemplateIcon(template.title);

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{template.title}</h3>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(template.difficulty)}`}>
              {template.difficulty}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">{template.description}</p>
      
      <motion.button
        onClick={() => onLaunch(template.id)}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Launch Template</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};