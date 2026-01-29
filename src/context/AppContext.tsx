'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { AppState, AppAction, Project, Task, Note, Reminder } from '@/types';
import { useAuth } from './AuthContext';

const initialState: AppState = {
  projects: [],
  tasks: [],
  notes: [],
  reminders: [],
  users: [],
  isLoading: true,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'LOAD_DATA':
      return { ...state, ...action.payload, isLoading: false };

    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
        tasks: state.tasks.filter((t) => t.projectId !== action.payload),
        notes: state.notes.filter((n) => n.projectId !== action.payload),
        reminders: state.reminders.filter((r) => r.projectId !== action.payload),
      };

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        reminders: state.reminders.filter((r) => r.taskId !== action.payload),
      };

    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload.id ? { ...n, ...action.payload.updates } : n
        ),
      };

    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter((n) => n.id !== action.payload) };

    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, action.payload] };

    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload.updates } : r
        ),
      };

    case 'DELETE_REMINDER':
      return { ...state, reminders: state.reminders.filter((r) => r.id !== action.payload) };

    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };

    case 'CLEANUP_OLD_PROJECTS':
      return {
        ...state,
        projects: state.projects.filter((p) => !action.payload.projectIds.includes(p.id)),
        tasks: state.tasks.filter((t) => !action.payload.projectIds.includes(t.projectId)),
        notes: state.notes.filter((n) => !action.payload.projectIds.includes(n.projectId)),
      };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => Promise<Reminder>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// API helper functions
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const [projects, tasks, notes, reminders] = await Promise.all([
        fetchAPI<Project[]>('/api/projects'),
        fetchAPI<Task[]>('/api/tasks'),
        fetchAPI<Note[]>('/api/notes'),
        fetchAPI<Reminder[]>('/api/reminders'),
      ]);

      dispatch({
        type: 'LOAD_DATA',
        payload: {
          projects,
          tasks,
          notes,
          reminders,
          users: [],
        },
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const project = await fetchAPI<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        ...projectData,
        ownerId: user?.id || 'mock-user-id',
      }),
    });

    dispatch({ type: 'ADD_PROJECT', payload: project });
    return project;
  }, [user]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    const project = await fetchAPI<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    dispatch({ type: 'UPDATE_PROJECT', payload: { id, updates: project } });
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await fetchAPI(`/api/projects/${id}`, { method: 'DELETE' });
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  }, []);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const task = await fetchAPI<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });

    dispatch({ type: 'ADD_TASK', payload: task });
    return task;
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const task = await fetchAPI<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    dispatch({ type: 'UPDATE_TASK', payload: { id, updates: task } });
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await fetchAPI(`/api/tasks/${id}`, { method: 'DELETE' });
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const addNote = useCallback(async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const note = await fetchAPI<Note>('/api/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });

    dispatch({ type: 'ADD_NOTE', payload: note });
    return note;
  }, []);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    const note = await fetchAPI<Note>(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    dispatch({ type: 'UPDATE_NOTE', payload: { id, updates: note } });
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    await fetchAPI(`/api/notes/${id}`, { method: 'DELETE' });
    dispatch({ type: 'DELETE_NOTE', payload: id });
  }, []);

  const addReminder = useCallback(async (reminderData: Omit<Reminder, 'id' | 'createdAt'>) => {
    const reminder = await fetchAPI<Reminder>('/api/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });

    dispatch({ type: 'ADD_REMINDER', payload: reminder });
    return reminder;
  }, []);

  const updateReminder = useCallback(async (id: string, updates: Partial<Reminder>) => {
    const reminder = await fetchAPI<Reminder>(`/api/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    dispatch({ type: 'UPDATE_REMINDER', payload: { id, updates: reminder } });
  }, []);

  const deleteReminder = useCallback(async (id: string) => {
    await fetchAPI(`/api/reminders/${id}`, { method: 'DELETE' });
    dispatch({ type: 'DELETE_REMINDER', payload: id });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addNote,
        updateNote,
        deleteNote,
        addReminder,
        updateReminder,
        deleteReminder,
        refreshData: loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
