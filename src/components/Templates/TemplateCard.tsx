import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Image, Users, ArrowRight } from 'lucide-react';
import { Template } from '../../types';
import Card from '../UI/Card';

interface TemplateCardProps {
  template: Template;
  onLaunch: (templateId: string) => void;
}

const iconMap = {
  coins: Coins,
  image: Image,
  users: Users,
};

export default function TemplateCard({ template, onLaunch }: TemplateCardProps) {
  const Icon = iconMap[template.icon as keyof typeof iconMap] || Coins;
  
  const getDifficultyColor = () => {
    switch (template.difficulty) {
      case 'Débutant':
        return 'bg-green-100 text-green-800';
      case 'Intermédiaire':
        return 'bg-orange-100 text-orange-800';
      case 'Avancé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
          {template.difficulty}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">{template.description}</p>
      
      <motion.button
        onClick={() => onLaunch(template.id)}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Lancer ce template</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </Card>
  );
}