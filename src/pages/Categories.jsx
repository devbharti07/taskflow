import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TASK_CATEGORIES } from '../utils/taskUtils';
import { TaskList } from '../components/tasks/TaskList';
import { Tag, Plus, GraduationCap, User, Briefcase, BookOpen, FolderGit2, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/common/Button';

const CATEGORY_ICONS = {
  College: GraduationCap,
  Personal: User,
  Work: Briefcase,
  Study: BookOpen,
  Projects: FolderGit2,
  Other: MoreHorizontal
};

export const Categories = () => {
  const { tasks, openCreateTaskModal, settings } = useTaskContext();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Compute counts
  const categoryCounts = {};
  TASK_CATEGORIES.forEach((c) => {
    categoryCounts[c] = tasks.filter((t) => t.category === c).length;
  });

  const filteredTasks =
    selectedCategory === 'All'
      ? tasks
      : tasks.filter((t) => t.category === selectedCategory);

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
            <Tag size={22} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Categories
            </h2>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Organize tasks by focus areas and college domains
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() =>
            openCreateTaskModal({
              category: selectedCategory !== 'All' ? selectedCategory : 'College'
            })
          }
        >
          Add {selectedCategory !== 'All' ? selectedCategory : ''} Task
        </Button>
      </div>

      {/* Category Pills / Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className="stat-card"
          style={{
            cursor: 'pointer',
            textAlign: 'left',
            borderColor: selectedCategory === 'All' ? 'var(--color-primary)' : 'var(--border-color)',
            boxShadow: selectedCategory === 'All' ? '0 0 0 2px var(--color-primary-light)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
              All Categories
            </span>
            <span className="badge badge-category-Other">{tasks.length}</span>
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
            Complete portfolio
          </span>
        </button>

        {TASK_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] || Tag;
          const count = categoryCounts[cat] || 0;
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className="stat-card"
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                boxShadow: isSelected ? '0 0 0 2px var(--color-primary-light)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Icon size={16} />
                  <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                    {cat}
                  </span>
                </div>
                <span className={`badge badge-category-${cat}`}>{count}</span>
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                {count === 1 ? '1 active task' : `${count} tasks`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Task List */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          {selectedCategory === 'All' ? 'All Categorized Tasks' : `${selectedCategory} Tasks`} ({filteredTasks.length})
        </h3>
        <TaskList
          tasks={filteredTasks}
          viewMode={settings.preferredView || 'grid'}
          emptyTitle={`No ${selectedCategory} tasks found`}
          emptyDescription={`You don't have any tasks under the ${selectedCategory} category yet.`}
          emptyActionLabel={`Add ${selectedCategory} Task`}
          onEmptyAction={() =>
            openCreateTaskModal({
              category: selectedCategory !== 'All' ? selectedCategory : 'College'
            })
          }
        />
      </div>
    </div>
  );
};
