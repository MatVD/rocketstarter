import { useState, useEffect } from "react";
import { Task } from "../types";
import {
  getTasks,
  getTasksByProject,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  assignTaskToSelf,
  releaseTask,
  requestReview,
  approveTask,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../api";

// Hook for fetching tasks
export const useTasks = (projectId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = projectId
        ? await getTasksByProject(projectId)
        : await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = () => {
    fetchTasks();
  };

  return { tasks, loading, error, refetch };
};

// Hook for fetching a single task
export const useTask = (id: string | null) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setTask(null);
      return;
    }

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTask(id);
        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  return { task, loading, error };
};

// Hook for task CRUD operations
export const useTaskMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateTaskRequest): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);
      const task = await createTask(data);
      return task;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    id: string,
    data: UpdateTaskRequest
  ): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);
      const task = await updateTask(id, data);
      return task;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await deleteTask(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, remove, loading, error };
};

// Hook for task workflow operations
export const useTaskWorkflow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignToSelf = async (
    taskId: string,
    builderAddress: string
  ): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);
      const task = await assignTaskToSelf(taskId, builderAddress);
      return task;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign task");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const release = async (taskId: string): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);
      const task = await releaseTask(taskId);
      return task;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to release task");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitForReview = async (taskId: string): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);
      const task = await requestReview(taskId);
      return task;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit for review"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const approve = async (taskId: string): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);
      const task = await approveTask(taskId);
      return task;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve task");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { assignToSelf, release, submitForReview, approve, loading, error };
};
