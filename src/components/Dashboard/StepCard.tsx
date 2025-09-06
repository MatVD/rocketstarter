import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, ArrowRight } from 'lucide-react';
import { Step } from '../../types';

interface StepCardProps {
  step: Step;
  showCompleteButton?: boolean;
  onComplete?: (stepId: string) => void;
}

export const StepCard: React.FC<StepCardProps> = ({ 
  step, 
  showCompleteButton = false, 
  onComplete 
}) => {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <ArrowRight className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (step.status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in-progress':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <motion.div
      className={`p-4 rounded-lg border ${getStatusColor()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getStatusIcon()}
          <div>
            <h4 className="font-medium text-gray-900">{step.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          </div>
        </div>
        
        {showCompleteButton && step.status !== 'completed' && (
          <motion.button
            onClick={() => onComplete?.(step.id)}
            className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Complete
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};