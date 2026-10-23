import React from 'react';
import {
  Check,
  Star,
  Clock,
  Calendar,
  Edit3,
  Trash2,
  AlertCircle
} from 'lucide-react';
import {
  formatTime,
  getRelativeDueDateLabel,
  isTaskOverdue,
  isTaskDueToday
} from '../../utils/dateUtils';

export const TaskCard = ({
  task,
  onToggleStatus,
  onToggleStar,
  onEdit,
  onDelete
}) => {
  const isCompleted = task.status === 'completed';
  const isOverdue = !isCompleted && isTaskOverdue(task.dueDate, task.dueTime, false);
  const isToday = !isCompleted && isTaskDueToday(task.dueDate);
  const relativeDateLabel = getRelativeDueDateLabel(task.dueDate, task.dueTime, isCompleted);

  return (
    <article
      className={`task-card animate-fade-in ${isCompleted ? 'completed' : ''}`}
      data-testid="task-card"
    >
      <div className="task-card-header">
        {/* Completion Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isCompleted}
          aria-label={`Mark "${task.title}" as ${isCompleted ? 'pending' : 'completed'}`}
          className={`task-checkbox-btn ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggleStatus(task.id)}
        >
          {isCompleted && <Check size={14} strokeWidth={3} />}
        </button>

        {/* Title & Description */}
        <div className="task-title-area">
          <h3 className="task-title">{task.title}</h3>
          {task.description && <p className="task-desc">{task.description}</p>}
        </div>

        {/* Action icons */}
        <div className="task-actions">
          <button
            type="button"
            className={`task-action-btn ${task.isStarred ? 'star-active' : ''}`}
            onClick={() => onToggleStar(task.id)}
            aria-label={task.isStarred ? 'Unstar task' : 'Star task'}
            title={task.isStarred ? 'Unstar task' : 'Star task'}
          >
            <Star
              size={17}
              fill={task.isStarred ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </button>

          <button
            type="button"
            className="task-action-btn"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            title="Edit task"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            className="task-action-btn delete-hover"
            onClick={() => onDelete(task)}
            aria-label="Delete task"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Footer Badges & Due Date */}
      <div className="task-card-footer">
        <div className="task-badges">
          {/* Category Badge */}
          <span className={`badge badge-category-${task.category || 'Other'}`}>
            {task.category || 'Other'}
          </span>

          {/* Priority Badge */}
          <span className={`badge badge-priority-${task.priority || 'Medium'}`}>
            {task.priority || 'Medium'}
          </span>
        </div>

        {/* Due Date & Time indicator */}
        {task.dueDate && (
          <div
            className={`task-due-info ${isOverdue ? 'overdue' : isToday ? 'due-today' : ''}`}
            title={task.dueDate}
          >
            {isOverdue ? (
              <AlertCircle size={14} />
            ) : (
              <Calendar size={13} />
            )}
            <span>{relativeDateLabel}</span>
            {task.dueTime && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginLeft: '2px' }}>
                <Clock size={12} />
                {formatTime(task.dueTime)}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
