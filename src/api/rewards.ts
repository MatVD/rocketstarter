import { CreateRewardRequest, Reward } from "../types";
import api from "./client";

/**
 * Create a new reward for a task
 */
export const createReward = async (
  rewardData: CreateRewardRequest
): Promise<Reward> => {
  const response = await api.post<Reward>("/rewards", rewardData);
  return response.data;
};

/**
 * Get all rewards for a specific task
 */
export const getTaskRewards = async (taskId: number): Promise<Reward[]> => {
  const response = await api.get<Reward[]>(`/rewards/task/${taskId}`);
  return response.data;
};

/**
 * Update a reward (only if onChain: false)
 */
export const updateReward = async (
  rewardId: number,
  updates: Partial<CreateRewardRequest>
): Promise<Reward> => {
  const response = await api.patch<Reward>(`/rewards/${rewardId}`, updates);
  return response.data;
};

/**
 * Delete a reward
 */
export const deleteReward = async (rewardId: number): Promise<void> => {
  await api.delete(`/rewards/${rewardId}`);
};
