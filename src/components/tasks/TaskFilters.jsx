import React from 'react';
import {
  Search,
  X,
  LayoutGrid,
  List,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../../utils/taskUtils';
import { Button } from '../common/Button';

export const TaskFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
  totalResults
}) => {
  const isFiltered =
    Boolean(filters.search) ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.dueDatePreset !== 'all';

  return (
    <div className="filter-toolbar">
      {/* Top Row: Search and View Mode */}
      <div className="filter-row-top">
        <div className="search-input-wrapper filter-search-input">
          <Search size={16} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.4rem', paddingRight: filters.search ? '2.4rem' : '0.85rem' }}
            placeholder="Search tasks by title or description..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
          {filters.search && (
            <button
              type="button"
              className="btn-ghost"
              style={{ position: 'absolute', right: '0.6rem', padding: '0.2rem' }}
              onClick={() => onFilterChange('search', '')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* View Mode Toggle and Result Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {totalResults} {totalResults === 1 ? 'task' : 'tasks'}
          </span>

          <div className="view-toggle-group">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onViewModeChange('list')}
              aria-label="List view"
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Filter Dropdowns & Sorter */}
      <div className="filter-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>
          <SlidersHorizontal size={14} />
          <span style={{ fontWeight: 600 }}>Filters:</span>
        </div>

        {/* Category */}
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {TASK_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Priority */}
        <select
          className="filter-select"
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p} Priority
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>

        {/* Due Date Presets */}
        <select
          className="filter-select"
          value={filters.dueDatePreset}
          onChange={(e) => onFilterChange('dueDatePreset', e.target.value)}
          aria-label="Filter by due date"
        >
          <option value="all">All Due Dates</option>
          <option value="today">Due Today</option>
          <option value="this_week">Due This Week</option>
          <option value="overdue">Overdue</option>
          <option value="no_date">No Due Date</option>
        </select>

        {/* Sort By */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Sort:</span>
          <select
            className="filter-select"
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            aria-label="Sort tasks"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDate">Due Date (Soonest)</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            icon={RotateCcw}
            style={{ color: 'var(--color-primary)' }}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
