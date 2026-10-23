import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Tag,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const { stats, openCreateTaskModal } = useTaskContext();

  const navItems = [
    {
      to: '/',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/tasks',
      label: 'My Tasks',
      icon: CheckSquare,
      badge: stats.total
    },
    {
      to: '/today',
      label: 'Today',
      icon: Calendar,
      badge: stats.dueTodayCount > 0 ? stats.dueTodayCount : null,
      badgeVariant: 'warning'
    },
    {
      to: '/upcoming',
      label: 'Upcoming',
      icon: Clock,
      badge: null
    },
    {
      to: '/important',
      label: 'Important',
      icon: Star,
      badge: stats.starredCount > 0 ? stats.starredCount : null,
      badgeVariant: 'primary'
    },
    {
      to: '/completed',
      label: 'Completed',
      icon: CheckCircle,
      badge: stats.completed > 0 ? stats.completed : null
    },
    {
      to: '/categories',
      label: 'Categories',
      icon: Tag,
      badge: null
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside
      className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="sidebar-header">
        <NavLink to="/" className="brand-container" onClick={onCloseMobile}>
          <div className="brand-logo">
            <Layers size={22} />
          </div>
          {!isCollapsed && (
            <div className="brand-title">
              TaskFlow <span>Pro</span>
              <span className="brand-badge">SaaS</span>
            </div>
          )}
        </NavLink>

        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Primary Action Button */}
      <div className="sidebar-add-task-wrapper">
        <button
          type="button"
          className="sidebar-add-task-btn"
          onClick={() => {
            openCreateTaskModal();
            onCloseMobile();
          }}
          aria-label="Add new task"
          title="Add New Task"
        >
          <Plus size={18} strokeWidth={2.5} />
          {!isCollapsed && <span>Add New Task</span>}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav-section">
        {!isCollapsed && <div className="sidebar-nav-label">Navigation</div>}
        <ul className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-nav-item ${isActive ? 'active' : ''}`
                  }
                  onClick={onCloseMobile}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="sidebar-nav-item-content">
                    <Icon size={18} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge !== null && (
                    <span className="sidebar-nav-badge">{item.badge}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer System Status */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Productivity Rate</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {stats.completionRate}%
            </span>
          </div>
          <div className="progress-bar-container" style={{ margin: 0 }}>
            <div className="progress-bar-fill" style={{ width: `${stats.completionRate}%` }} />
          </div>
        </div>
      )}
    </aside>
  );
};
