import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  getStoredTasks,
  saveStoredTasks,
  getStoredSettings,
  saveStoredSettings,
  getSampleTasks,
  clearAllStoredData
} from '../services/taskStorage';
import { calculateTaskStats } from '../utils/taskUtils';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => getStoredTasks());
  const [settings, setSettings] = useState(() => getStoredSettings());
  const [globalSearch, setGlobalSearch] = useState('');
  const [toasts, setToasts] = useState([]);

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Auto-persist tasks when state changes
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  // Persist settings
  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Toast Notification Dispatcher
  const addToast = useCallback((message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Task Operations
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title.trim(),
      description: (taskData.description || '').trim(),
      category: taskData.category || settings.defaultCategory || 'College',
      priority: taskData.priority || settings.defaultPriority || 'Medium',
      dueDate: taskData.dueDate || null,
      dueTime: taskData.dueTime || null,
      status: 'pending',
      isStarred: Boolean(taskData.isStarred),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null
    };

    setTasks((prev) => [newTask, ...prev]);
    addToast(`Task "${newTask.title}" created successfully!`, 'success');
    return newTask;
  }, [settings, addToast]);

  const updateTask = useCallback((taskId, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            ...updatedFields,
            title: updatedFields.title ? updatedFields.title.trim() : t.title,
            description: updatedFields.description !== undefined ? updatedFields.description.trim() : t.description,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
    addToast('Task updated successfully.', 'info');
  }, [addToast]);

  const deleteTask = useCallback((taskId) => {
    let deletedTitle = '';
    setTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      if (target) deletedTitle = target.title;
      return prev.filter((t) => t.id !== taskId);
    });
    addToast(`Deleted "${deletedTitle || 'task'}".`, 'info');
  }, [addToast]);

  const toggleTaskStatus = useCallback((taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isNowCompleted = t.status !== 'completed';
          if (isNowCompleted && settings.enableConfetti) {
            try {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#4F46E5', '#10B981', '#0EA5E9', '#F59E0B']
              });
            } catch {
              // Ignore if canvas-confetti is unsupported
            }
          }
          return {
            ...t,
            status: isNowCompleted ? 'completed' : 'pending',
            completedAt: isNowCompleted ? new Date().toISOString() : null,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
  }, [settings.enableConfetti]);

  const toggleTaskStar = useCallback((taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            isStarred: !t.isStarred,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
  }, []);

  const resetToSampleTasks = useCallback(() => {
    const samples = getSampleTasks();
    setTasks(samples);
    addToast('Sample tasks restored successfully!', 'success');
  }, [addToast]);

  const clearAllTasks = useCallback(() => {
    clearAllStoredData();
    setTasks([]);
    addToast('All tasks have been cleared.', 'info');
  }, [addToast]);

  const importTasks = useCallback((importedList, mode = 'merge') => {
    if (mode === 'replace') {
      setTasks(importedList);
      addToast(`Replaced current tasks with ${importedList.length} imported tasks.`, 'success');
    } else {
      // Merge mode: retain existing, append new ones avoiding duplicate ids
      setTasks((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const nonDuplicates = importedList.filter((t) => !existingIds.has(t.id));
        return [...nonDuplicates, ...prev];
      });
      addToast(`Successfully merged ${importedList.length} tasks!`, 'success');
    }
  }, [addToast]);

  // Modal helpers
  const openCreateTaskModal = useCallback((initialValues = null) => {
    setEditingTask(initialValues);
    setIsTaskModalOpen(true);
  }, []);

  const openEditTaskModal = useCallback((task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Settings saved.', 'success');
  }, [addToast]);

  // Dynamically derived stats from tasks
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);

  const value = {
    tasks,
    stats,
    settings,
    updateSettings,
    globalSearch,
    setGlobalSearch,
    toasts,
    addToast,
    removeToast,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    toggleTaskStar,
    resetToSampleTasks,
    clearAllTasks,
    importTasks,
    isTaskModalOpen,
    editingTask,
    openCreateTaskModal,
    openEditTaskModal,
    closeTaskModal
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
