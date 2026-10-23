import React, { useState, useMemo, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { filterTasks, sortTasks } from '../utils/taskUtils';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskList } from '../components/tasks/TaskList';
import { Plus } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AllTasks = () => {
  const {
    tasks,
    globalSearch,
    setGlobalSearch,
    settings,
    openCreateTaskModal
  } = useTaskContext();

  const [viewMode, setViewMode] = useState(settings.preferredView || 'grid');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'completed', 'important', 'overdue'

  const [filters, setFilters] = useState({
    search: globalSearch || '',
    category: 'all',
    priority: 'all',
    status: 'all',
    dueDatePreset: 'all',
    sortBy: 'newest'
  });

  // Sync global search from header if changed
  useEffect(() => {
    if (globalSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: globalSearch }));
    }
  }, [globalSearch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'search') {
      setGlobalSearch(value);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      priority: 'all',
      status: 'all',
      dueDatePreset: 'all',
      sortBy: 'newest'
    });
    setGlobalSearch('');
    setActiveTab('all');
  };

  // Filter tasks based on both active tab and toolbar filters
  const displayedTasks = useMemo(() => {
    const combinedFilters = {
      ...filters,
      isStarredOnly: activeTab === 'important',
      status: activeTab !== 'all' && activeTab !== 'important' ? activeTab : filters.status
    };

    const filtered = filterTasks(tasks, combinedFilters);
    return sortTasks(filtered, filters.sortBy);
  }, [tasks, filters, activeTab]);

  const tabs = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'important', label: 'Important' },
    { id: 'overdue', label: 'Overdue' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Header and Quick Add */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            My Tasks
          </h2>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
            Manage, filter, and organize all your personal and academic tasks
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => openCreateTaskModal()}>
          Add Task
        </Button>
      </div>

      {/* Quick Status Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)'
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comprehensive Filter Toolbar */}
      <TaskFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={displayedTasks.length}
      />

      {/* Task List / Grid */}
      <TaskList
        tasks={displayedTasks}
        viewMode={viewMode}
        emptyTitle={
          filters.search ? 'No matching tasks found' : `No ${activeTab !== 'all' ? activeTab : ''} tasks`
        }
        emptyDescription={
          filters.search
            ? `No tasks match your search query "${filters.search}". Try clearing filters.`
            : 'You have no tasks in this view. Click "Add Task" to get started!'
        }
        emptyActionLabel="Add New Task"
        onEmptyAction={() => openCreateTaskModal()}
      />
    </div>
  );
};
