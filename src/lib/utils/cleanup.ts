import { Project, Task, Note, Reminder } from '@/types';

interface CleanupResult {
  projects: Project[];
  tasks: Task[];
  notes: Note[];
  reminders: Reminder[];
  removedProjectIds: string[];
}

export function cleanupOldProjects(
  projects: Project[],
  tasks: Task[],
  notes: Note[],
  reminders: Reminder[]
): CleanupResult {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const projectsToRemove = projects.filter(
    (p) => p.completedAt && new Date(p.completedAt) < twoMonthsAgo
  );

  const removedProjectIds = projectsToRemove.map((p) => p.id);

  if (removedProjectIds.length === 0) {
    return { projects, tasks, notes, reminders, removedProjectIds: [] };
  }

  const filteredProjects = projects.filter((p) => !removedProjectIds.includes(p.id));
  const filteredTasks = tasks.filter((t) => !removedProjectIds.includes(t.projectId));
  const filteredNotes = notes.filter((n) => !removedProjectIds.includes(n.projectId));
  const filteredReminders = reminders.filter(
    (r) => !r.projectId || !removedProjectIds.includes(r.projectId)
  );

  return {
    projects: filteredProjects,
    tasks: filteredTasks,
    notes: filteredNotes,
    reminders: filteredReminders,
    removedProjectIds,
  };
}

export function shouldRunCleanup(): boolean {
  if (typeof window === 'undefined') return false;

  const lastCleanup = localStorage.getItem('last_cleanup');
  if (!lastCleanup) return true;

  const lastDate = new Date(lastCleanup);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  return daysDiff >= 1;
}

export function markCleanupRun(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('last_cleanup', new Date().toISOString());
}
