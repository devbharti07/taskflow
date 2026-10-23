import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TaskList } from '../components/tasks/TaskList';
import { Star, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Important = () => {
  const { tasks, openCreateTaskModal, settings } = useTaskContext();
  const [viewMode, setViewMode] = useState(settings.preferredView || 'grid');

  const starredTasks = tasks.filter((t) => t.isStarred);

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
            <Star size={22} fill="#F59E0B" color="#F59E0B" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Important Tasks
            </h2>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            High-priority starred tasks requiring special attention
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => openCreateTaskModal({ isStarred: true })}
        >
          Add Important Task
        </Button>
      </div>

      <TaskList
        tasks={starredTasks}
        viewMode={viewMode}
        emptyTitle="No starred tasks yet"
        emptyDescription="Mark critical tasks as important by clicking the star icon on any task card."
        emptyActionLabel="Create Important Task"
        onEmptyAction={() => openCreateTaskModal({ isStarred: true })}
      />
    </div>
  );
};
