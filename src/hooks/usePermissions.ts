'use client';

import { useAuth } from '@/context/AuthContext';
import { Project } from '@/types';

export function usePermissions() {
  const { user, isManager } = useAuth();

  const canViewProject = (project: Project): boolean => {
    if (!user) return false;
    return isManager || project.ownerId === user.id;
  };

  const canEditProject = (project: Project): boolean => {
    if (!user) return false;
    return isManager || project.ownerId === user.id;
  };

  const canDeleteProject = (project: Project): boolean => {
    if (!user) return false;
    return isManager || project.ownerId === user.id;
  };

  const canCreateProject = (): boolean => {
    return !!user;
  };

  const isOwner = (project: Project): boolean => {
    if (!user) return false;
    return project.ownerId === user.id;
  };

  return {
    canViewProject,
    canEditProject,
    canDeleteProject,
    canCreateProject,
    isOwner,
    isManager,
  };
}
