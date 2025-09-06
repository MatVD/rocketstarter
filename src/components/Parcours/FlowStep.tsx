import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Circle, ArrowRight } from 'lucide-react';
import { Step } from '../../types';
import Card from '../UI/Card';

interface FlowStepProps {
  step: Step;
  isLast?: boolean;
  onDetails: (stepId: string) => void;
}

export default function FlowStep({ step, isLast = false, onDetails }: FlowStepProps) {
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
      <Card hover className={`p-4 min-w-[280px] border-2 ${getBorderColor()}`}>
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{step.description}</p>
            <motion.button
              onClick={() => onDetails(step.id)}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Voir détails →
            </motion.button>
          </div>
        </div>
      </Card>
      
      {!isLast && (
        <div className="flex items-center mx-4">
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </div>
  );
}