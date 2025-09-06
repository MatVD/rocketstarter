import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Circle } from 'lucide-react';
import { Step } from '../../types';
import Card from '../UI/Card';

interface StepCardProps {
  step: Step;
  showButton?: boolean;
  onComplete?: (stepId: string) => void;
}

export default function StepCard({ step, showButton = false, onComplete }: StepCardProps) {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (step.status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in-progress':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card hover className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`p-2 rounded-lg ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{step.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          </div>
        </div>
        
        {showButton && step.status !== 'completed' && (
          <motion.button
            onClick={() => onComplete?.(step.id)}
            className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Terminer
          </motion.button>
        )}
      </div>
    </Card>
  );
}