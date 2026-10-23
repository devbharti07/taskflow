import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Plus,
  Sun,
  Moon
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { getFormattedHeaderDate } from '../../utils/dateUtils';

const PAGE_TITLES = {
  '/': 'Dashboard Overview',
  '/tasks': 'My Tasks',
  '/today': 'Today’s Agenda',
  '/upcoming': 'Upcoming Schedule',
  '/important': 'Important Tasks',
  '/completed': 'Completed Tasks',
  '/categories': 'Task Categories',
  '/settings': 'Settings & Preferences'
};

export const Header = ({ onOpenMobile, theme, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    globalSearch,
    setGlobalSearch,
    openCreateTaskModal
  } = useTaskContext();

  const pageTitle = PAGE_TITLES[location.pathname] || 'TaskFlow Pro';
  const currentDate = getFormattedHeaderDate();

  // Keyboard shortcut Ctrl+K / Cmd+K handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        const isEditable = document.activeElement && document.activeElement.isContentEditable;
        if (activeTag === 'input' || activeTag === 'textarea' || isEditable) {
          return;
        }
        e.preventDefault();
        openCreateTaskModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openCreateTaskModal]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setGlobalSearch(val);
    // If not already on tasks page, navigate to tasks page to see search results in real time
    if (val.trim() && location.pathname !== '/tasks') {
      navigate('/tasks');
    }
  };

  return (
    <header className="app-header">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenMobile}
          aria-label="Open mobile navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-title-block">
          <h1 className="header-title">{pageTitle}</h1>
          <span className="header-date">{currentDate}</span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="header-center">
        <div className="header-search">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="header-search-input"
              placeholder="Search all tasks..."
              value={globalSearch}
              onChange={handleSearchChange}
              aria-label="Global search tasks"
            />
            <div className="search-kbd-shortcut" title="Press Ctrl+K to add task">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions, Theme Toggle, User Profile */}
      <div className="header-right">
        {/* Quick Add Button */}
        <button
          type="button"
          className="quick-add-btn"
          onClick={() => openCreateTaskModal()}
          aria-label="Quick add task"
          title="Quick add task (Ctrl+K)"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Task</span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Avatar */}
        <div className="user-profile-badge" title="Student / Developer Profile">
          <div className="user-avatar">TF</div>
          <span className="user-name">Alex M.</span>
        </div>
      </div>
    </header>
  );
};
