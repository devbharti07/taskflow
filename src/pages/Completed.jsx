import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TaskList } from '../components/tasks/TaskList';
import { CheckCircle2, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Completed = () => {
  const { tasks, settings, deleteTask } = useTaskContext();
  const [viewMode, setViewMode] = useState(settings.preferredView || 'grid');

  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const handleClearAllCompleted = () => {
    if (window.confirm('Are you sure you want to delete all completed tasks?')) {
      completedTasks.forEach((t) => deleteTask(t.id));
    }
  };

  return (
    <div className="animate-fade-in">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={22} color="var(--color-success)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Completed Tasks
            </h2>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Review your achievements and completed workflow items
          </p>
        </div>

        {completedTasks.length > 0 && (
          <Button
            variant="secondary"
            icon={Trash2}
            onClick={handleClearAllCompleted}
            style={{ color: 'var(--color-danger)' }}
          >
            Clear Completed ({completedTasks.length})
          </Button>
        )}
      </div>

      <TaskList
        tasks={completedTasks}
        viewMode={viewMode}
        emptyTitle="No completed tasks yet"
        emptyDescription="As you complete assignments and to-dos, they will be archived here for your review."
      />
    </div>
  );
};
