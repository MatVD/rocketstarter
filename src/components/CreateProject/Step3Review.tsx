import { motion } from "framer-motion";
import { useState } from "react";
import { Users, Tag, Eye, Plus, X } from "lucide-react";
import { Building2, FileText, Hash } from "lucide-react";

interface Step3Props {
  formData: {
    name: string;
    description: string;
    logoUrl: string;
    status: number;
  };
  steps: Array<{ name: string; description: string }>;
  whitelist: string[];
  onWhitelistChange: (whitelist: string[]) => void;
}

export default function Step3Review({ formData, steps, whitelist, onWhitelistChange }: Step3Props) {
  const [whitelistInput, setWhitelistInput] = useState("");
  const [whitelistError, setWhitelistError] = useState("");

  const handleAddAddress = () => {
    const address = whitelistInput.trim().toLowerCase();
    
    if (!address) return;
    
    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setWhitelistError("Invalid Ethereum address format");
      return;
    }
    
    if (whitelist.includes(address)) {
      setWhitelistError("Address already in whitelist");
      return;
    }
    
    onWhitelistChange([...whitelist, address]);
    setWhitelistInput("");
    setWhitelistError("");
  };

  const handleRemoveAddress = (address: string) => {
    onWhitelistChange(whitelist.filter((a) => a !== address));
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
          Review & Finalize
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure whitelist and review your project
        </p>
      </div>

      {/* Whitelist */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Whitelist (Optional)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add Ethereum addresses that are authorized to interact with this project
        </p>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={whitelistInput}
            onChange={(e) => {
              setWhitelistInput(e.target.value);
              setWhitelistError("");
            }}
            onKeyPress={(e) => e.key === "Enter" && handleAddAddress()}
            placeholder="0x..."
            className={`
              flex-1 px-4 py-3 rounded-lg border
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              transition-all duration-200
              ${
                whitelistError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              }
              focus:ring-2 focus:outline-none
            `}
          />
          <button
            onClick={handleAddAddress}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        
        {whitelistError && (
          <p className="text-sm text-red-500">{whitelistError}</p>
        )}
        
        {whitelist.length > 0 && (
          <div className="space-y-2">
            {whitelist.map((address, index) => (
              <motion.div
                key={address}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-sm text-gray-900 dark:text-white font-mono">
                  {address}
                </span>
                <button
                  onClick={() => handleRemoveAddress(address)}
                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Project Summary
        </h3>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 space-y-4">
          {/* Project Info */}
          <div className="flex items-start gap-4">
            {formData.logoUrl && (
              <img
                src={formData.logoUrl}
                alt={formData.name}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  {formData.name || "Untitled Project"}
                </h4>
              </div>
              {formData.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {formData.description}
                </p>
              )}
            </div>
          </div>

          {/* Steps Count */}
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Hash className="w-4 h-4" />
            <span className="text-sm font-medium">
              {steps.length} workflow step{steps.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Steps List */}
          {steps.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Workflow Steps:
              </h5>
              <ol className="space-y-2">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {step.name}
                      </span>
                      {step.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Whitelist Count */}
          {whitelist.length > 0 && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">
                {whitelist.length} whitelisted address{whitelist.length !== 1 ? 'es' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
