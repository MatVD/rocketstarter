import React from 'react';
import { motion } from 'framer-motion';
import { FlowStep } from '../components/Parcours/FlowStep';
import { flowSteps } from '../data/mockData';

export const Parcours: React.FC = () => {
  const handleViewDetails = (stepId: string) => {
    console.log('View details for step:', stepId);
  };

  const currentStep = flowSteps.find(step => step.status === 'in-progress');

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Transition Journey</h1>
          <p className="text-gray-600">Follow your Web2 to Web3 transformation step by step</p>
          
          {currentStep && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Current Step:</span> {currentStep.title}
              </p>
            </div>
          )}
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="flex items-center space-x-0 min-w-max">
            {flowSteps.map((step, index) => (
              <FlowStep
                key={step.id}
                step={step}
                isLast={index === flowSteps.length - 1}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};