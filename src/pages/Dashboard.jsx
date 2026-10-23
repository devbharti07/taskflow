import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  TrendingUp,
  Calendar,
  Plus
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { getGreeting } from '../utils/dateUtils';
import { StatCard } from '../components/dashboard/StatCard';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { TaskCard } from '../components/tasks/TaskCard';
import { EmptyState } from '../components/tasks/EmptyState';
import { Button } from '../components/common/Button';
import { isTaskDueToday, isDueSoon } from '../utils/dateUtils';
import { sortTasks } from '../utils/taskUtils';

export const Dashboard = () => {
  const {
    tasks,
    stats,
    toggleTaskStatus,
    toggleTaskStar,
    openEditTaskModal,
    deleteTask,
    openCreateTaskModal
  } = useTaskContext();

  const greeting = getGreeting();

  // Tasks due today
  const todayTasks = tasks.filter(
    (t) => t.status !== 'completed' && isTaskDueToday(t.dueDate)
  );

  // Upcoming deadlines (next 3-5 days, pending)
  const upcomingDeadlines = sortTasks(
    tasks.filter((t) => t.status !== 'completed' && t.dueDate && isDueSoon(t.dueDate, 5)),
    'dueDate'
  ).slice(0, 4);

  // Recently created tasks (last 4)
  const recentTasks = sortTasks(tasks, 'newest').slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
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
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {greeting}, Alex! 👋
          </h2>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Here is your productivity breakdown and priority schedule for today.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => openCreateTaskModal()}>
          Add New Task
        </Button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={ListTodo}
          variant="primary"
          subtitle={`${stats.starredCount} marked as important`}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          variant="success"
          progress={stats.completionRate}
          subtitle={`${stats.completionRate}% completion rate`}
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          variant="warning"
          subtitle={`${stats.dueTodayCount} due today`}
        />

        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          variant="danger"
          subtitle={stats.overdue > 0 ? 'Requires immediate action' : 'All deadlines met!'}
        />
      </div>

      {/* Recharts Analytics: Productivity & Category Distribution */}
      <div className="dashboard-charts-grid">
        <ProductivityChart tasks={tasks} />
        <CategoryChart tasks={tasks} />
      </div>

      {/* Schedule Highlights: Due Today & Upcoming Deadlines */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.25rem',
          marginTop: '0.5rem'
        }}
      >
        {/* Today's Tasks */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Calendar size={18} color="var(--color-primary)" />
                Tasks Due Today
              </h3>
              <p className="card-subtitle">
                {todayTasks.length} pending {todayTasks.length === 1 ? 'task' : 'tasks'} for today
              </p>
            </div>
            {todayTasks.length > 0 && (
              <span className="badge badge-priority-High">Priority Today</span>
            )}
          </div>

          {todayTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-tertiary)' }}>
              <CheckCircle2 size={36} color="var(--color-success)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>All clear for today!</p>
              <p style={{ fontSize: 'var(--font-size-xs)', marginTop: '0.25rem' }}>
                No pending tasks are due today.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {todayTasks.slice(0, 3).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={toggleTaskStatus}
                  onToggleStar={toggleTaskStar}
                  onEdit={openEditTaskModal}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Clock size={18} color="var(--color-secondary)" />
                Upcoming Deadlines
              </h3>
              <p className="card-subtitle">Tasks scheduled over the next few days</p>
            </div>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-tertiary)' }}>
              <TrendingUp size={36} color="var(--color-primary)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No immediate deadlines</p>
              <p style={{ fontSize: 'var(--font-size-xs)', marginTop: '0.25rem' }}>
                You have no upcoming tasks due in the next 5 days.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingDeadlines.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={toggleTaskStatus}
                  onToggleStar={toggleTaskStar}
                  onEdit={openEditTaskModal}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
