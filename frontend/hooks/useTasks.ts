/**
 * Task management hook
 */
'use client';

import { useCallback, useState } from 'react';
import { api } from '@/lib/api';
import type {
  Task,
  TaskCreateRequest,
  TaskFilterParams,
  TaskListResponse,
  TaskUpdateRequest,
} from '@/types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (params?: TaskFilterParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getTasks(params);
      setTasks(response.tasks);
      setTotal(response.total);
      setPage(response.page);
      setPageSize(response.pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: TaskCreateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const task = await api.createTask(data);
      setTasks((prev) => [task, ...prev]);
      setTotal((prev) => prev + 1);
      return task;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: TaskUpdateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const task = await api.updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      return task;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeTask = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const task = await api.completeTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      return task;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tasks,
    total,
    page,
    pageSize,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
  };
}
