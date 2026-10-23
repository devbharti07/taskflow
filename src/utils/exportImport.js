import { format } from 'date-fns';
import { TASK_CATEGORIES, TASK_PRIORITIES } from './taskUtils';

/**
 * Triggers a download of current tasks as a formatted JSON file.
 */
export const exportTasksToJSON = (tasks = []) => {
  try {
    const exportData = {
      app: 'TaskFlow Pro',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      taskCount: tasks.length,
      tasks: tasks
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const dateSlug = format(new Date(), 'yyyy-MM-dd');
    link.href = url;
    link.download = `taskflow-pro-export-${dateSlug}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to export tasks' };
  }
};

/**
 * Validates and normalizes imported JSON data.
 * Checks for array of tasks or an export wrapper object.
 */
export const validateAndParseImportJSON = (jsonString) => {
  if (!jsonString || typeof jsonString !== 'string') {
    return { isValid: false, error: 'Empty or invalid file content provided.' };
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    return { isValid: false, error: 'Malformed JSON file: Unable to parse syntax.' };
  }

  let taskArray = [];
  if (Array.isArray(parsed)) {
    taskArray = parsed;
  } else if (parsed && Array.isArray(parsed.tasks)) {
    taskArray = parsed.tasks;
  } else {
    return {
      isValid: false,
      error: 'Invalid format: JSON must contain a tasks array or an export object with a "tasks" property.'
    };
  }

  if (taskArray.length === 0) {
    return {
      isValid: false,
      error: 'The imported file contains no tasks.'
    };
  }

  const validTasks = [];
  const errors = [];

  taskArray.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      errors.push(`Item at index ${index} is not an object.`);
      return;
    }

    if (!item.title || typeof item.title !== 'string' || !item.title.trim()) {
      errors.push(`Item at index ${index} is missing a required task title.`);
      return;
    }

    // Sanitize and normalize task
    const normalized = {
      id: item.id && typeof item.id === 'string' ? item.id : `task-${Date.now()}-${index}`,
      title: item.title.trim(),
      description: typeof item.description === 'string' ? item.description.trim() : '',
      category: TASK_CATEGORIES.includes(item.category) ? item.category : 'Other',
      priority: TASK_PRIORITIES.includes(item.priority) ? item.priority : 'Medium',
      dueDate: typeof item.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.dueDate) ? item.dueDate : null,
      dueTime: typeof item.dueTime === 'string' && /^\d{2}:\d{2}$/.test(item.dueTime) ? item.dueTime : null,
      status: item.status === 'completed' ? 'completed' : 'pending',
      isStarred: Boolean(item.isStarred),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      completedAt: item.status === 'completed' ? (item.completedAt || new Date().toISOString()) : null
    };

    validTasks.push(normalized);
  });

  if (validTasks.length === 0) {
    return {
      isValid: false,
      error: errors.length > 0 ? errors.join(' ') : 'No valid tasks found in import.'
    };
  }

  return {
    isValid: true,
    tasks: validTasks,
    warning: errors.length > 0 ? `Imported ${validTasks.length} tasks (${errors.length} skipped due to invalid format).` : null
  };
};
