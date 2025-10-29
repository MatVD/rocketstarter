import { create } from "zustand";
import { Step, CreateStepRequest, UpdateStepRequest } from "../types";
import {
  getSteps,
  getStepsByProject,
  getStep,
  createStep,
  updateStep,
  deleteStep,
} from "../api";

interface StepState {
  // State
  steps: Step[];
  selectedStep: Step | null;
  activeStepId: string | null;
  lastProjectId: string | null;
  stepsLoading: boolean;
  stepsError: string | null;

  // Actions
  fetchSteps: (projectId?: string) => Promise<void>;
  fetchStep: (id: string) => Promise<void>;
  createNewStep: (data: CreateStepRequest) => Promise<Step | null>;
  updateExistingStep: (
    id: string,
    data: UpdateStepRequest
  ) => Promise<Step | null>;
  removeStep: (id: string) => Promise<boolean>;
  setSelectedStep: (step: Step | null) => void;
  setActiveStepId: (stepId: string | null) => void;
  refetchSteps: () => Promise<void>;
}

export const useStepStore = create<StepState>((set, get) => ({
  // Initial state
  steps: [],
  selectedStep: null,
  activeStepId: null,
  lastProjectId: null,
  stepsLoading: false,
  stepsError: null,

  // Actions
  fetchSteps: async (projectId?: string) => {
    set({ 
      stepsLoading: true, 
      stepsError: null,
      lastProjectId: projectId ?? null
    });
    try {
      const data = projectId ? await getStepsByProject(projectId) : await getSteps();
      set({ steps: data, stepsLoading: false });
    } catch (err) {
      set({
        stepsError:
          err instanceof Error ? err.message : "Failed to fetch steps",
        stepsLoading: false,
      });
    }
  },

  fetchStep: async (id: string) => {
    set({ stepsLoading: true, stepsError: null });
    try {
      const data = await getStep(id);
      set({ selectedStep: data, stepsLoading: false });
    } catch (err) {
      set({
        stepsError:
          err instanceof Error ? err.message : "Failed to fetch step",
        stepsLoading: false,
      });
    }
  },

  createNewStep: async (data: CreateStepRequest) => {
    set({ stepsLoading: true, stepsError: null });
    try {
      const step = await createStep(data);
      set((state) => ({
        steps: [...state.steps, step],
        stepsLoading: false,
      }));
      return step;
    } catch (err) {
      set({
        stepsError:
          err instanceof Error ? err.message : "Failed to create step",
        stepsLoading: false,
      });
      return null;
    }
  },

  updateExistingStep: async (id: string, data: UpdateStepRequest) => {
    set({ stepsLoading: true, stepsError: null });
    try {
      const updatedStep = await updateStep(id, data);
      set((state) => ({
        steps: state.steps.map((s) =>
          s.id === parseInt(id) ? updatedStep : s
        ),
        selectedStep:
          state.selectedStep?.id === parseInt(id)
            ? updatedStep
            : state.selectedStep,
        stepsLoading: false,
      }));
      return updatedStep;
    } catch (err) {
      set({
        stepsError:
          err instanceof Error ? err.message : "Failed to update step",
        stepsLoading: false,
      });
      return null;
    }
  },

  removeStep: async (id: string) => {
    set({ stepsLoading: true, stepsError: null });
    try {
      await deleteStep(id);
      set((state) => ({
        steps: state.steps.filter((s) => s.id !== parseInt(id)),
        stepsLoading: false,
      }));
      return true;
    } catch (err) {
      set({
        stepsError:
          err instanceof Error ? err.message : "Failed to delete step",
        stepsLoading: false,
      });
      return false;
    }
  },

  setSelectedStep: (step) => set({ selectedStep: step }),

  setActiveStepId: (stepId) => set({ activeStepId: stepId }),

  refetchSteps: async () => {
    const { lastProjectId, fetchSteps } = get();
    await fetchSteps(lastProjectId ?? undefined);
  },
}));