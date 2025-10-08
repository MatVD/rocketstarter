import { Step } from "../../types";
import ProgressIndicator from "./StepNavigation/ProgressIndicator";

interface StepNavigationProps {
  currentStep: Step | null;
  allSteps: Step[];
  onStepChange: (stepId: number) => void;
}

export default function StepNavigation({
  currentStep,
  allSteps,
  onStepChange,
}: StepNavigationProps) {
  if (!currentStep) return null;

  const currentIndex = allSteps.findIndex((step) => step.id === currentStep.id);
  const previousStep = currentIndex > 0 ? allSteps[currentIndex - 1] : null;
  const nextStep =
    currentIndex < allSteps.length - 1 ? allSteps[currentIndex + 1] : null;

  return (
    <div className="flex justify-center mb-6">
      {/* Current Step Indicator with Navigation */}
      <ProgressIndicator
        currentIndex={currentIndex}
        totalSteps={allSteps.length}
        currentTitle={currentStep.title}
        onPrevious={
          previousStep ? () => onStepChange(previousStep.id) : undefined
        }
        onNext={nextStep ? () => onStepChange(nextStep.id) : undefined}
      />
    </div>
  );
}
