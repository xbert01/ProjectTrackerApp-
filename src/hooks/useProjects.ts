'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Project } from '@/types';

export function useProjects() {
  const { state, addProject, updateProject, deleteProject } = useApp();
  const { user, isManager } = useAuth();

  const visibleProjects = useMemo(() => {
    if (!user) return [];
    if (isManager) return state.projects;
    return state.projects.filter((p) => p.ownerId === user.id);
  }, [state.projects, user, isManager]);

  const activeProjects = useMemo(() => {
    return visibleProjects.filter((p) => p.status === 'active');
  }, [visibleProjects]);

  const pausedProjects = useMemo(() => {
    return visibleProjects.filter((p) => p.status === 'paused');
  }, [visibleProjects]);

  const completedProjects = useMemo(() => {
    return visibleProjects.filter((p) => p.status === 'completed');
  }, [visibleProjects]);

  const getProject = (id: string): Project | undefined => {
    return visibleProjects.find((p) => p.id === id);
  };

  const createProject = async (data: Omit<Project, 'id' | 'createdAt' | 'ownerId'>) => {
    if (!user) throw new Error('Must be logged in to create a project');

    return addProject({
      ...data,
      ownerId: user.id,
    });
  };

  const completeProject = async (id: string) => {
    await updateProject(id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
  };

  const reactivateProject = async (id: string) => {
    await updateProject(id, {
      status: 'active',
      completedAt: undefined,
    });
  };

  return {
    projects: visibleProjects,
    activeProjects,
    pausedProjects,
    completedProjects,
    isLoading: state.isLoading,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    completeProject,
    reactivateProject,
  };
}
