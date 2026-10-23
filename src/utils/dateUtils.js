import {
  format,
  parseISO,
  isToday as dfIsToday,
  isTomorrow as dfIsTomorrow,
  isPast,
  isWithinInterval,
  addDays,
  startOfToday,
  endOfDay,
  startOfWeek,
  subDays,
  isSameDay,
  isValid
} from 'date-fns';

/**
 * Formats an ISO or YYYY-MM-DD date string nicely.
 */
export const formatDate = (dateStr, formatPattern = 'MMM d, yyyy') => {
  if (!dateStr) return '';
  try {
    const date = typeof dateStr === 'string' && dateStr.length === 10
      ? new Date(`${dateStr}T00:00:00`)
      : parseISO(dateStr);
    if (!isValid(date)) return '';
    return format(date, formatPattern);
  } catch {
    return '';
  }
};

/**
 * Formats a 24h time string (HH:mm) into 12h format (e.g. 2:30 PM).
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  try {
    const [hours, minutes] = timeStr.split(':');
    const dummyDate = new Date();
    dummyDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return format(dummyDate, 'h:mm a');
  } catch {
    return timeStr;
  }
};

/**
 * Checks if a YYYY-MM-DD string is today.
 */
export const isTaskDueToday = (dateStr) => {
  if (!dateStr) return false;
  try {
    const date = new Date(`${dateStr}T00:00:00`);
    return dfIsToday(date);
  } catch {
    return false;
  }
};

/**
 * Checks if a task is overdue (strictly if due date is passed and task is not completed).
 * If date is today, check time if provided.
 */
export const isTaskOverdue = (dateStr, timeStr = null, isCompleted = false) => {
  if (isCompleted || !dateStr) return false;
  try {
    const now = new Date();
    let taskDueDateTime;

    if (timeStr) {
      taskDueDateTime = new Date(`${dateStr}T${timeStr}:00`);
    } else {
      // Due by the very end of the specified day
      taskDueDateTime = endOfDay(new Date(`${dateStr}T00:00:00`));
    }

    if (!isValid(taskDueDateTime)) return false;
    return isPast(taskDueDateTime);
  } catch {
    return false;
  }
};

/**
 * Checks if a task is due within the next N days.
 */
export const isDueSoon = (dateStr, daysAhead = 3) => {
  if (!dateStr) return false;
  try {
    const today = startOfToday();
    const futureLimit = endOfDay(addDays(today, daysAhead));
    const target = new Date(`${dateStr}T00:00:00`);
    return isWithinInterval(target, { start: today, end: futureLimit });
  } catch {
    return false;
  }
};

/**
 * Friendly relative label for due dates (e.g., 'Today', 'Tomorrow', 'Overdue', or 'Nov 12').
 */
export const getRelativeDueDateLabel = (dateStr, timeStr = null, isCompleted = false) => {
  if (!dateStr) return null;
  if (isTaskOverdue(dateStr, timeStr, isCompleted)) {
    return 'Overdue';
  }
  try {
    const date = new Date(`${dateStr}T00:00:00`);
    if (dfIsToday(date)) return 'Today';
    if (dfIsTomorrow(date)) return 'Tomorrow';
    return formatDate(dateStr, 'MMM d');
  } catch {
    return dateStr;
  }
};

/**
 * Returns dynamic greeting based on current local hour.
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Formats header date: "Friday, October 23, 2026"
 */
export const getFormattedHeaderDate = () => {
  return format(new Date(), 'EEEE, MMMM d, yyyy');
};

/**
 * Get last 7 days array with formatted names for charts.
 */
export const getLast7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = subDays(today, i);
    days.push({
      date: d,
      dateStr: format(d, 'yyyy-MM-dd'),
      dayName: format(d, 'EEE'),
      fullDate: format(d, 'MMM d')
    });
  }
  return days;
};
