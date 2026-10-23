import {
  isTaskDueToday,
  isTaskOverdue,
  getLast7Days,
  isDueSoon
} from './dateUtils';
import { isWithinInterval, startOfWeek, endOfWeek, addDays, startOfToday, endOfDay } from 'date-fns';

export const TASK_CATEGORIES = [
  'College',
  'Personal',
  'Work',
  'Study',
  'Projects',
  'Other'
];

export const TASK_PRIORITIES = ['High', 'Medium', 'Low'];

/**
 * Calculates dynamic statistics from tasks collection.
 */
export const calculateTaskStats = (tasks = []) => {
  const total = tasks.length;
  let completed = 0;
  let overdue = 0;
  let dueTodayCount = 0;
  let starredCount = 0;

  tasks.forEach((task) => {
    if (task.status === 'completed') {
      completed++;
    } else {
      if (isTaskOverdue(task.dueDate, task.dueTime, false)) {
        overdue++;
      }
      if (isTaskDueToday(task.dueDate)) {
        dueTodayCount++;
      }
    }
    if (task.isStarred) {
      starredCount++;
    }
  });

  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    overdue,
    dueTodayCount,
    starredCount,
    completionRate
  };
};

/**
 * Filter tasks by search query and various criteria.
 */
export const filterTasks = (tasks = [], filters = {}) => {
  const {
    search = '',
    category = 'all',
    priority = 'all',
    status = 'all',
    dueDatePreset = 'all',
    isStarredOnly = false
  } = filters;

  return tasks.filter((task) => {
    // 1. Text Search (title and description)
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = (task.title || '').toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    // 2. Starred Filter
    if (isStarredOnly && !task.isStarred) {
      return false;
    }

    // 3. Category Filter
    if (category !== 'all' && task.category !== category) {
      return false;
    }

    // 4. Priority Filter
    if (priority !== 'all' && task.priority !== priority) {
      return false;
    }

    // 5. Status Filter
    if (status === 'completed' && task.status !== 'completed') return false;
    if (status === 'pending' && task.status !== 'pending') return false;
    if (status === 'overdue') {
      if (task.status === 'completed' || !isTaskOverdue(task.dueDate, task.dueTime, false)) {
        return false;
      }
    }

    // 6. Due Date Preset Filter
    if (dueDatePreset !== 'all') {
      if (dueDatePreset === 'today') {
        if (!isTaskDueToday(task.dueDate)) return false;
      } else if (dueDatePreset === 'this_week') {
        if (!task.dueDate) return false;
        try {
          const taskDate = new Date(`${task.dueDate}T00:00:00`);
          const now = new Date();
          const start = startOfWeek(now, { weekStartsOn: 1 });
          const end = endOfWeek(now, { weekStartsOn: 1 });
          if (!isWithinInterval(taskDate, { start, end })) return false;
        } catch {
          return false;
        }
      } else if (dueDatePreset === 'overdue') {
        if (!isTaskOverdue(task.dueDate, task.dueTime, task.status === 'completed')) return false;
      } else if (dueDatePreset === 'no_date') {
        if (task.dueDate) return false;
      }
    }

    return true;
  });
};

/**
 * Sort tasks according to criteria.
 */
export const sortTasks = (tasks = [], sortBy = 'newest') => {
  const list = [...tasks];

  switch (sortBy) {
    case 'newest':
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    case 'oldest':
      return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    case 'dueDate':
      return list.sort((a, b) => {
        // Tasks without due date go to the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const dateTimeA = a.dueTime ? `${a.dueDate}T${a.dueTime}` : `${a.dueDate}T23:59:59`;
        const dateTimeB = b.dueTime ? `${b.dueDate}T${b.dueTime}` : `${b.dueDate}T23:59:59`;
        return new Date(dateTimeA) - new Date(dateTimeB);
      });

    case 'priority': {
      const priorityWeights = { High: 3, Medium: 2, Low: 1 };
      return list.sort((a, b) => (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0));
    }

    case 'title':
      return list.sort((a, b) => a.title.localeCompare(b.title));

    default:
      return list;
  }
};

/**
 * Returns 7-day data for productivity chart.
 * Counts tasks completed on that date and tasks created on that date.
 */
export const getWeeklyProductivityData = (tasks = []) => {
  const days = getLast7Days();

  return days.map(({ dayName, dateStr }) => {
    let completedCount = 0;
    let createdCount = 0;

    tasks.forEach((task) => {
      // Completed date
      if (task.completedAt && task.completedAt.startsWith(dateStr)) {
        completedCount++;
      }
      // Created date
      if (task.createdAt && task.createdAt.startsWith(dateStr)) {
        createdCount++;
      }
    });

    return {
      name: dayName,
      Completed: completedCount,
      Created: createdCount
    };
  });
};

/**
 * Returns category distribution data for pie/bar chart.
 */
export const getCategoryDistribution = (tasks = []) => {
  const counts = {};
  TASK_CATEGORIES.forEach((c) => {
    counts[c] = 0;
  });

  tasks.forEach((task) => {
    const cat = task.category || 'Other';
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const categoryColorMap = {
    College: '#6366F1',
    Personal: '#10B981',
    Work: '#F59E0B',
    Study: '#8B5CF6',
    Projects: '#0EA5E9',
    Other: '#64748B'
  };

  return TASK_CATEGORIES.map((category) => ({
    name: category,
    value: counts[category] || 0,
    color: categoryColorMap[category] || '#64748B'
  })).filter(item => item.value > 0);
};

/**
 * Groups upcoming tasks into sections:
 * - Tomorrow
 * - Later This Week
 * - Next Week
 * - Later
 */
export const groupUpcomingTasks = (tasks = []) => {
  const today = startOfToday();
  const tomorrow = addDays(today, 1);
  const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });
  const endOfNextWeek = endOfWeek(addDays(endOfThisWeek, 1), { weekStartsOn: 1 });

  const groups = {
    tomorrow: [],
    thisWeek: [],
    nextWeek: [],
    later: []
  };

  const pendingUpcoming = tasks.filter((t) => {
    if (t.status === 'completed' || !t.dueDate) return false;
    const taskDate = new Date(`${t.dueDate}T00:00:00`);
    return taskDate > endOfDay(today);
  });

  // Sort upcoming chronologically
  const sorted = sortTasks(pendingUpcoming, 'dueDate');

  sorted.forEach((task) => {
    const taskDate = new Date(`${task.dueDate}T00:00:00`);
    if (isWithinInterval(taskDate, { start: tomorrow, end: endOfDay(tomorrow) })) {
      groups.tomorrow.push(task);
    } else if (taskDate <= endOfThisWeek) {
      groups.thisWeek.push(task);
    } else if (taskDate <= endOfNextWeek) {
      groups.nextWeek.push(task);
    } else {
      groups.later.push(task);
    }
  });

  return groups;
};
