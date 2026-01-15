import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useProjectStore, useStepStore } from "../store";
import { useUserStore } from "../store/user.store";
import { useToast } from "../contexts/ToastContext";
import { CreateProjectRequest } from "../types";
import StepIndicator from "../components/CreateProject/StepIndicator";
import Step1ProjectInfo from "../components/CreateProject/Step1ProjectInfo";
import Step2StepsConfig from "../components/CreateProject/Step2StepsConfig";
import Step3Review from "../components/CreateProject/Step3Review";
import { COLORS } from "../constants/colors";

const STEP_TITLES = ["Project Info", "Workflow Steps", "Review & Create"];

interface StepConfig {
  name: string;
  description: string;
}

export default function CreateProject() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { createNewProject } = useProjectStore();
  const { createNewStep } = useStepStore();
  const { showSuccess, showError } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1: Project Info
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    status: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2: Steps Configuration
  const [steps, setSteps] = useState<StepConfig[]>([]);

  // Step 3: Whitelist
  const [whitelist, setWhitelist] = useState<string[]>([]);

  const handleFormChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
    } else if (formData.name.length > 255) {
      newErrors.name = "Project name must not exceed 255 characters";
    }

    if (formData.logo && formData.logo.trim()) {
      try {
        new URL(formData.logo);
      } catch {
        newErrors.logo = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (steps.length === 0) {
      showError("Please add at least one step");
      return false;
    }

    const emptyStep = steps.find((s) => !s.name.trim());
    if (emptyStep) {
      showError("All steps must have a name");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        showError("Please fix the errors before continuing");
        return;
      }
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user?.address) {
      showError("User not authenticated");
      return;
    }

    setSaving(true);

    try {
      // 1. Create project
      const projectData: CreateProjectRequest = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        logo: formData.logo?.trim() ? formData.logo.trim() : undefined,
        whitelist: whitelist.length > 0 ? whitelist : undefined,
        status: formData.status,
      };

      const createdProject = await createNewProject(projectData);
      
      if (!createdProject) {
        throw new Error("Failed to create project");
      }

      // 2. Create steps for the project
      for (const step of steps) {
        await createNewStep({
          projectId: createdProject.id,
          name: step.name.trim(),
          description: step.description?.trim() || undefined,
        });
      }

      showSuccess("Project created successfully!");
      navigate(`/projects/${createdProject.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      showError("Failed to create project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/my-projects");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 md:p-10 lg:p-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Cancel
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set up your Web3 project step by step
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={3}
          stepTitles={STEP_TITLES}
        />

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1ProjectInfo
                formData={formData}
                onChange={handleFormChange}
                errors={errors}
              />
            )}
            {currentStep === 2 && (
              <Step2StepsConfig steps={steps} onChange={setSteps} />
            )}
            {currentStep === 3 && (
              <Step3Review
                formData={formData}
                steps={steps}
                whitelist={whitelist}
                onWhitelistChange={setWhitelist}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium
              transition-all duration-200
              ${
                currentStep === 1
                  ? "opacity-50 cursor-not-allowed text-gray-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }
            `}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${COLORS.button.primary}`}
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                  ${COLORS.button.success}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Create Project
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
