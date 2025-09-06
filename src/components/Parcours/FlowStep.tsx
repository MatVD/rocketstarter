import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Circle, ArrowRight } from 'lucide-react';
import { Step } from '../../types';

interface FlowStepProps {
  step: Step;
  isLast?: boolean;
  onViewDetails: (stepId: string) => void;
}

export const FlowStep: React.FC<FlowStepProps> = ({ step, isLast = false, onViewDetails }) => {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <Check className="w-5 h-5 text-white" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-white" />;
      default:
        return <Circle className="w-5 h-5 text-white" />;
    }
  };

  const getStatusColor = () => {
    switch (step.status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-orange-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getBorderColor = () => {
    switch (step.status) {
      case 'completed':
        return 'border-green-200';
      case 'in-progress':
        return 'border-orange-200';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <div className="flex items-center">
      <motion.div
        className={`bg-white rounded-lg border-2 ${getBorderColor()} p-6 min-w-[280px]`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start space-x-4">
          <div className={`w-10 h-10 rounded-full ${getStatusColor()} flex items-center justify-center`}>
            {getStatusIcon()}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{step.description}</p>
            
            <motion.button
              onClick={() => onViewDetails(step.id)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {!isLast && (
        <div className="flex items-center mx-4">
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </div>
  );
};