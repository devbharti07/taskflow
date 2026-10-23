import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { groupUpcomingTasks } from '../utils/taskUtils';
import { TaskList } from '../components/tasks/TaskList';
import { Clock, Plus, Calendar } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Upcoming = () => {
  const { tasks, openCreateTaskModal, settings } = useTaskContext();
  const groups = groupUpcomingTasks(tasks);

  const totalUpcoming =
    groups.tomorrow.length +
    groups.thisWeek.length +
    groups.nextWeek.length +
    groups.later.length;

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
            <Clock size={22} color="var(--color-secondary)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Upcoming Deadlines
            </h2>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Chronological overview of scheduled tasks and milestones
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => openCreateTaskModal()}>
          Schedule Task
        </Button>
      </div>

      {totalUpcoming === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-secondary-light)',
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <Clock size={32} />
          </div>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            No upcoming tasks scheduled
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            You have no upcoming deadlines. Add upcoming college assignments, project milestones, or personal tasks.
          </p>
          <Button variant="primary" icon={Plus} onClick={() => openCreateTaskModal()}>
            Add Future Task
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Tomorrow */}
          {groups.tomorrow.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge badge-priority-High">Tomorrow</span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  ({groups.tomorrow.length} {groups.tomorrow.length === 1 ? 'task' : 'tasks'})
                </span>
              </div>
              <TaskList tasks={groups.tomorrow} viewMode={settings.preferredView || 'grid'} />
            </div>
          )}

          {/* Later This Week */}
          {groups.thisWeek.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge badge-priority-Medium">Later This Week</span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  ({groups.thisWeek.length} {groups.thisWeek.length === 1 ? 'task' : 'tasks'})
                </span>
              </div>
              <TaskList tasks={groups.thisWeek} viewMode={settings.preferredView || 'grid'} />
            </div>
          )}

          {/* Next Week */}
          {groups.nextWeek.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge badge-priority-Low">Next Week</span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  ({groups.nextWeek.length} {groups.nextWeek.length === 1 ? 'task' : 'tasks'})
                </span>
              </div>
              <TaskList tasks={groups.nextWeek} viewMode={settings.preferredView || 'grid'} />
            </div>
          )}

          {/* Later */}
          {groups.later.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                  Later Beyond Next Week
                </span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  ({groups.later.length} {groups.later.length === 1 ? 'task' : 'tasks'})
                </span>
              </div>
              <TaskList tasks={groups.later} viewMode={settings.preferredView || 'grid'} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
