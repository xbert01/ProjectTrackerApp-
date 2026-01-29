import { Project, Task, Note, Reminder, User } from '@/types';
import { localStorageAdapter } from './localStorage';
import { runMigrations, setSchemaVersion, getLatestVersion } from './migrations';

export const STORAGE_KEYS = {
  PROJECTS: 'projects',
  TASKS: 'tasks',
  NOTES: 'notes',
  REMINDERS: 'reminders',
  USERS: 'users',
} as const;

export const storage = {
  projects: {
    getAll: () => localStorageAdapter.getAll<Project>(STORAGE_KEYS.PROJECTS),
    getById: (id: string) => localStorageAdapter.getById<Project>(STORAGE_KEYS.PROJECTS, id),
    create: (project: Project) => localStorageAdapter.create(STORAGE_KEYS.PROJECTS, project),
    update: (id: string, updates: Partial<Project>) =>
      localStorageAdapter.update<Project>(STORAGE_KEYS.PROJECTS, id, updates),
    delete: (id: string) => localStorageAdapter.delete(STORAGE_KEYS.PROJECTS, id),
    bulkDelete: (ids: string[]) => localStorageAdapter.bulkDelete(STORAGE_KEYS.PROJECTS, ids),
    bulkSave: (projects: Project[]) => localStorageAdapter.bulkSave(STORAGE_KEYS.PROJECTS, projects),
  },

  tasks: {
    getAll: () => localStorageAdapter.getAll<Task>(STORAGE_KEYS.TASKS),
    getById: (id: string) => localStorageAdapter.getById<Task>(STORAGE_KEYS.TASKS, id),
    create: (task: Task) => localStorageAdapter.create(STORAGE_KEYS.TASKS, task),
    update: (id: string, updates: Partial<Task>) =>
      localStorageAdapter.update<Task>(STORAGE_KEYS.TASKS, id, updates),
    delete: (id: string) => localStorageAdapter.delete(STORAGE_KEYS.TASKS, id),
    bulkDelete: (ids: string[]) => localStorageAdapter.bulkDelete(STORAGE_KEYS.TASKS, ids),
    bulkSave: (tasks: Task[]) => localStorageAdapter.bulkSave(STORAGE_KEYS.TASKS, tasks),
  },

  notes: {
    getAll: () => localStorageAdapter.getAll<Note>(STORAGE_KEYS.NOTES),
    getById: (id: string) => localStorageAdapter.getById<Note>(STORAGE_KEYS.NOTES, id),
    create: (note: Note) => localStorageAdapter.create(STORAGE_KEYS.NOTES, note),
    update: (id: string, updates: Partial<Note>) =>
      localStorageAdapter.update<Note>(STORAGE_KEYS.NOTES, id, updates),
    delete: (id: string) => localStorageAdapter.delete(STORAGE_KEYS.NOTES, id),
    bulkDelete: (ids: string[]) => localStorageAdapter.bulkDelete(STORAGE_KEYS.NOTES, ids),
    bulkSave: (notes: Note[]) => localStorageAdapter.bulkSave(STORAGE_KEYS.NOTES, notes),
  },

  reminders: {
    getAll: () => localStorageAdapter.getAll<Reminder>(STORAGE_KEYS.REMINDERS),
    getById: (id: string) => localStorageAdapter.getById<Reminder>(STORAGE_KEYS.REMINDERS, id),
    create: (reminder: Reminder) => localStorageAdapter.create(STORAGE_KEYS.REMINDERS, reminder),
    update: (id: string, updates: Partial<Reminder>) =>
      localStorageAdapter.update<Reminder>(STORAGE_KEYS.REMINDERS, id, updates),
    delete: (id: string) => localStorageAdapter.delete(STORAGE_KEYS.REMINDERS, id),
    bulkSave: (reminders: Reminder[]) =>
      localStorageAdapter.bulkSave(STORAGE_KEYS.REMINDERS, reminders),
  },

  users: {
    getAll: () => localStorageAdapter.getAll<User>(STORAGE_KEYS.USERS),
    getById: (id: string) => localStorageAdapter.getById<User>(STORAGE_KEYS.USERS, id),
    getByEmail: async (email: string) => {
      const users = await localStorageAdapter.getAll<User>(STORAGE_KEYS.USERS);
      return users.find((u) => u.email === email) || null;
    },
    create: (user: User) => localStorageAdapter.create(STORAGE_KEYS.USERS, user),
    update: (id: string, updates: Partial<User>) =>
      localStorageAdapter.update<User>(STORAGE_KEYS.USERS, id, updates),
  },

  async loadAll() {
    const [projects, tasks, notes, reminders, users] = await Promise.all([
      this.projects.getAll(),
      this.tasks.getAll(),
      this.notes.getAll(),
      this.reminders.getAll(),
      this.users.getAll(),
    ]);

    const migratedData = runMigrations({ projects, tasks, notes, reminders, users });

    return migratedData;
  },

  initializeStorage() {
    setSchemaVersion(getLatestVersion());
  },
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
