'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, TaskStatus } from '@/types';

export function useTasks(projectId?: string) {
  const { state, addTask, updateTask, deleteTask } = useApp();

  const tasks = useMemo(() => {
    if (projectId) {
      return state.tasks.filter((t) => t.projectId === projectId);
    }
    return state.tasks;
  }, [state.tasks, projectId]);

  const todoTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'todo');
  }, [tasks]);

  const inProgressTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'in_progress');
  }, [tasks]);

  const doneTasks = useMemo(() => {
    return tasks.filter((t) => t.status === 'done');
  }, [tasks]);

  const getTask = (id: string): Task | undefined => {
    return tasks.find((t) => t.id === id);
  };

  const getTasksByDate = (date: string): Task[] => {
    return tasks.filter((t) => t.calendarDate === date);
  };

  const createTask = async (data: Omit<Task, 'id' | 'createdAt'>) => {
    return addTask(data);
  };

  const toggleTaskStatus = async (id: string) => {
    const task = getTask(id);
    if (!task) return;

    // Cycle: todo -> in_progress -> done -> todo
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo',
    };

    await updateTask(id, {
      status: nextStatus[task.status],
    });
  };

  const setTaskStatus = async (id: string, status: TaskStatus) => {
    await updateTask(id, { status });
  };

  const moveTaskToDate = async (id: string, date: string) => {
    await updateTask(id, { calendarDate: date });
  };

  return {
    tasks,
    todoTasks,
    inProgressTasks,
    doneTasks,
    isLoading: state.isLoading,
    getTask,
    getTasksByDate,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setTaskStatus,
    moveTaskToDate,
  };
}
