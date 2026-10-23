import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';
import { DeleteConfirmation } from './DeleteConfirmation';
import { useTaskContext } from '../../context/TaskContext';

export const TaskList = ({
  tasks = [],
  viewMode = 'grid',
  emptyTitle = 'No tasks found',
  emptyDescription = 'You have no tasks matching this view. Try adjusting filters or create a new task.',
  emptyActionLabel,
  onEmptyAction
}) => {
  const {
    toggleTaskStatus,
    toggleTaskStar,
    openEditTaskModal,
    deleteTask
  } = useTaskContext();

  const [deletingTask, setDeletingTask] = useState(null);

  const handleDeleteClick = (task) => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = (taskId) => {
    deleteTask(taskId);
    setDeletingTask(null);
  };

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <>
      <div className={viewMode === 'list' ? 'tasks-list' : 'tasks-grid'}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleStatus={toggleTaskStatus}
            onToggleStar={toggleTaskStar}
            onEdit={openEditTaskModal}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={Boolean(deletingTask)}
        task={deletingTask}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
      />
    </>
  );
};
