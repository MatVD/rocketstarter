import { motion } from "framer-motion";
import Card from "../UI/Card";
import { Route } from "lucide-react";
import { flowSteps } from "../../data/mockData";
import FlowStep from "../Flow/FlowStep";


function StepByStep() {
  return (
    <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Route className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Step by step
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visualize your progress - Click "View details" to manage
                    tasks for each step
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 md:p-8 overflow-x-auto">
                <div className="flex items-center space-x-0 min-w-max">
                  {flowSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <FlowStep
                        step={step}
                        isLast={index === flowSteps.length - 1}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
  )
}

export default StepByStep