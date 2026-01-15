import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Trash2, Sparkles, Edit3 } from "lucide-react";
import { COLORS } from "../../constants/colors";

interface StepConfig {
  name: string;
  description: string;
}

interface Step2Props {
  steps: StepConfig[];
  onChange: (steps: StepConfig[]) => void;
}

const DEFAULT_TEMPLATES = [
  {
    name: "Web3 Standard",
    icon: "🚀",
    steps: [
      { name: "Requirements", description: "Gather and document project requirements" },
      { name: "Architecture", description: "Design system architecture and tech stack" },
      { name: "Smart Contracts", description: "Develop and review smart contracts" },
      { name: "Tests & Audit", description: "Testing and security audit" },
      { name: "Deployment", description: "Deploy to mainnet and launch" },
    ],
  },
  {
    name: "Minimal",
    icon: "⚡",
    steps: [
      { name: "Planning", description: "Plan the project scope" },
      { name: "Development", description: "Build the solution" },
      { name: "Launch", description: "Deploy and go live" },
    ],
  },
];

export default function Step2StepsConfig({ steps, onChange }: Step2Props) {
  const [useTemplate, setUseTemplate] = useState(steps.length === 0);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const handleTemplateSelect = (templateIndex: number) => {
    setSelectedTemplate(templateIndex);
    onChange(DEFAULT_TEMPLATES[templateIndex].steps);
    setUseTemplate(false);
  };

  const handleAddStep = () => {
    onChange([...steps, { name: "", description: "" }]);
  };

  const handleRemoveStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, field: "name" | "description", value: string) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    onChange(newSteps);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Configure Workflow Steps
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a template or create custom steps for your project
        </p>
      </div>

      {/* Template Selection or Custom Steps */}
      {useTemplate && steps.length === 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Choose a Template
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_TEMPLATES.map((template, index) => (
              <motion.button
                key={index}
                onClick={() => handleTemplateSelect(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  p-6 rounded-lg border-2 text-left
                  bg-white dark:bg-gray-800
                  border-gray-200 dark:border-gray-700
                  hover:border-blue-500 dark:hover:border-blue-400
                  transition-all duration-200
                "
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{template.icon}</span>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {template.steps.length} steps included
                </p>
                <ul className="space-y-1">
                  {template.steps.map((step, i) => (
                    <li key={i} className="text-sm text-gray-500 dark:text-gray-500">
                      {i + 1}. {step.name}
                    </li>
                  ))}
                </ul>
              </motion.button>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => {
                setUseTemplate(false);
                onChange([{ name: "", description: "" }]);
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Or create custom steps from scratch
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Custom Steps ({steps.length})
            </h3>
            <button
              onClick={handleAddStep}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${COLORS.button.primary}`}
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>

          {steps.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No steps yet. Add your first step to get started!
            </div>
          )}

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={step.name}
                    onChange={(e) => handleStepChange(index, "name", e.target.value)}
                    placeholder="Step name"
                    className="
                      w-full px-3 py-2 rounded-lg border
                      bg-white dark:bg-gray-700
                      text-gray-900 dark:text-white
                      border-gray-300 dark:border-gray-600
                      focus:ring-2 focus:ring-blue-500 focus:outline-none
                    "
                  />
                  <textarea
                    value={step.description}
                    onChange={(e) => handleStepChange(index, "description", e.target.value)}
                    placeholder="Step description (optional)"
                    rows={2}
                    className="
                      w-full px-3 py-2 rounded-lg border
                      bg-white dark:bg-gray-700
                      text-gray-900 dark:text-white
                      border-gray-300 dark:border-gray-600
                      focus:ring-2 focus:ring-blue-500 focus:outline-none
                      resize-none
                    "
                  />
                </div>
                <button
                  onClick={() => handleRemoveStep(index)}
                  className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {steps.length > 0 && (
            <button
              onClick={() => {
                setUseTemplate(true);
                onChange([]);
              }}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              ← Back to templates
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
