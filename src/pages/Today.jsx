import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { isTaskDueToday } from '../utils/dateUtils';
import { TaskList } from '../components/tasks/TaskList';
import { Plus, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { format } from 'date-fns';

export const Today = () => {
  const { tasks, openCreateTaskModal, settings } = useTaskContext();
  const [viewMode, setViewMode] = useState(settings.preferredView || 'grid');

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const todayTasks = tasks.filter((t) => isTaskDueToday(t.dueDate));
  const pendingToday = todayTasks.filter((t) => t.status !== 'completed');
  const completedToday = todayTasks.filter((t) => t.status === 'completed');

  const handleCreateTodayTask = () => {
    openCreateTaskModal({ dueDate: todayStr });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
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
            <Calendar size={22} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Today's Tasks
            </h2>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')} — Focus on what matters today
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleCreateTodayTask}>
          Add Task for Today
        </Button>
      </div>

      {todayTasks.length === 0 ? (
        <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <Calendar size={32} />
          </div>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Nothing scheduled for today!
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Enjoy the free time or plan ahead by scheduling assignments and goals for today.
          </p>
          <Button variant="primary" icon={Plus} onClick={handleCreateTodayTask}>
            Schedule a Task for Today
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Pending Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Pending Today ({pendingToday.length})
              </h3>
            </div>
            <TaskList
              tasks={pendingToday}
              viewMode={viewMode}
              emptyTitle="All pending tasks completed!"
              emptyDescription="Awesome work! You've checked off every pending task scheduled for today."
            />
          </div>

          {/* Completed Section */}
          {completedToday.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={18} color="var(--color-success)" />
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Completed Today ({completedToday.length})
                </h3>
              </div>
              <TaskList
                tasks={completedToday}
                viewMode={viewMode}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
