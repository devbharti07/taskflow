import { format, subDays, addDays } from 'date-fns';

const STORAGE_KEYS = {
  TASKS: 'taskflow_pro_tasks_v1',
  THEME: 'taskflow_pro_theme',
  SETTINGS: 'taskflow_pro_settings',
  INITIALIZED: 'taskflow_pro_initialized'
};

export const DEFAULT_SETTINGS = {
  defaultPriority: 'Medium',
  defaultCategory: 'College',
  preferredView: 'grid', // 'grid' | 'list'
  enableConfetti: true
};

/**
 * Generates sample tasks with dynamic relative dates so the app looks populated and lively.
 */
export const getSampleTasks = () => {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const threeDaysAheadStr = format(addDays(new Date(), 3), 'yyyy-MM-dd');
  const nextWeekStr = format(addDays(new Date(), 6), 'yyyy-MM-dd');

  return [
    {
      id: 'task-sample-1',
      title: 'Complete Distributed Systems Final Lab Report',
      description: 'Write implementation analysis and benchmark results for Raft consensus protocol.',
      category: 'College',
      priority: 'High',
      dueDate: todayStr,
      dueTime: '17:00',
      status: 'pending',
      isStarred: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      completedAt: null
    },
    {
      id: 'task-sample-2',
      title: 'Review React UI/UX Design System Guidelines',
      description: 'Check color contrast, accessibility focus rings, and micro-interactions.',
      category: 'Projects',
      priority: 'High',
      dueDate: todayStr,
      dueTime: '20:30',
      status: 'pending',
      isStarred: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: null
    },
    {
      id: 'task-sample-3',
      title: 'Submit Capstone Project Phase 2 Documentation',
      description: 'Format PDF documentation with architectural diagrams and ER schema.',
      category: 'College',
      priority: 'High',
      dueDate: tomorrowStr,
      dueTime: '23:59',
      status: 'pending',
      isStarred: true,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      completedAt: null
    },
    {
      id: 'task-sample-4',
      title: 'Prepare Slide Deck for Weekly Sprint Demo',
      description: 'Include metric dashboards, completed feature highlights, and Q&A points.',
      category: 'Work',
      priority: 'Medium',
      dueDate: threeDaysAheadStr,
      dueTime: '14:00',
      status: 'pending',
      isStarred: false,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      completedAt: null
    },
    {
      id: 'task-sample-5',
      title: 'Read System Design & Architecture Chapter 4',
      description: 'Focus on database partitioning, write-ahead logs, and message queues.',
      category: 'Study',
      priority: 'Medium',
      dueDate: nextWeekStr,
      dueTime: '18:00',
      status: 'pending',
      isStarred: false,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      completedAt: null
    },
    {
      id: 'task-sample-6',
      title: 'Gym Workout & 5K Cardio Session',
      description: 'Leg day routine followed by 20 minutes treadmill interval run.',
      category: 'Personal',
      priority: 'Low',
      dueDate: todayStr,
      dueTime: '07:30',
      status: 'completed',
      isStarred: false,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    },
    {
      id: 'task-sample-7',
      title: 'Organize Cloud Architecture Study Notes',
      description: 'Consolidate AWS and GCP notes into Notion workspace.',
      category: 'Study',
      priority: 'Low',
      dueDate: yesterdayStr,
      dueTime: '19:00',
      status: 'completed',
      isStarred: false,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];
};

/**
 * Load tasks from LocalStorage or seed with samples on first launch.
 */
export const getStoredTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      // First time launch: initialize with sample data
      const samples = getSampleTasks();
      saveStoredTasks(samples);
      return samples;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to read tasks from localStorage', err);
    return [];
  }
};

/**
 * Persist tasks to LocalStorage.
 */
export const saveStoredTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return true;
  } catch (err) {
    console.error('Failed to write tasks to localStorage', err);
    return false;
  }
};

/**
 * Load theme preference ('light' | 'dark').
 */
export const getStoredTheme = () => {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (theme === 'dark' || theme === 'light') {
      return theme;
    }
    // Check OS preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
};

/**
 * Save theme preference.
 */
export const saveStoredTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (err) {
    console.error('Failed to save theme', err);
  }
};

/**
 * Load user settings.
 */
export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save user settings.
 */
export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
};

/**
 * Clear all task data from storage.
 */
export const clearAllStoredData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    return true;
  } catch {
    return false;
  }
};
