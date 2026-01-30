// User
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  isManager: boolean;
  createdAt: string;
}

// Project
export interface Project {
  id: string;
  ownerId: string;
  clientName: string;
  description: string;
  links: {
    sow?: string;
    usabilityGuidelines?: string;
    githubRepository?: string;
    figma?: string;
    feedbackSpreadsheet?: string;
  };
  status: 'active' | 'paused' | 'completed';
  endDate?: string;
  createdAt: string;
  completedAt?: string;
}

// Task status type
export type TaskStatus = 'todo' | 'in_progress' | 'done';

// Task
export interface Task {
  id: string;
  projectId?: string;  // Optional - allows general/admin tasks
  title: string;
  status: TaskStatus;
  calendarDate: string;
  createdAt: string;
}

// Note
export interface Note {
  id: string;
  projectId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Reminder
export interface Reminder {
  id: string;
  projectId?: string;
  taskId?: string;
  message: string;
  triggerDate: string;
  isRead: boolean;
  createdAt: string;
}

// Storage adapter interface
export interface StorageAdapter {
  getAll<T extends { id: string }>(key: string): Promise<T[]>;
  getById<T extends { id: string }>(key: string, id: string): Promise<T | null>;
  create<T extends { id: string }>(key: string, item: T): Promise<T>;
  update<T extends { id: string }>(key: string, id: string, item: Partial<T>): Promise<T>;
  delete(key: string, id: string): Promise<void>;
  clear(key: string): Promise<void>;
}

// App state
export interface AppState {
  projects: Project[];
  tasks: Task[];
  notes: Note[];
  reminders: Reminder[];
  users: User[];
  isLoading: boolean;
  error: string | null;
}

// Action types
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: { id: string; updates: Partial<Reminder> } }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'CLEANUP_OLD_PROJECTS'; payload: { projectIds: string[] } };

// Calendar types
export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarState {
  view: CalendarView;
  currentDate: Date;
}

// Theme
export type Theme = 'light' | 'dark' | 'system';

// Search result
export interface SearchResult {
  type: 'project' | 'task' | 'note';
  id: string;
  title: string;
  subtitle?: string;
  projectId?: string;
}
