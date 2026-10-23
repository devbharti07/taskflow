import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { TaskModal } from './components/tasks/TaskModal';
import { ToastContainer } from './components/common/Toast';

import { Dashboard } from './pages/Dashboard';
import { AllTasks } from './pages/AllTasks';
import { Today } from './pages/Today';
import { Upcoming } from './pages/Upcoming';
import { Important } from './pages/Important';
import { Completed } from './pages/Completed';
import { Categories } from './pages/Categories';
import { Settings } from './pages/Settings';

export function AppContent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile Drawer Overlay */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="app-main">
        <Header
          onOpenMobile={() => setIsMobileMenuOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="page-container" id="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<AllTasks />} />
            <Route path="/today" element={<Today />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/important" element={<Important />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/categories" element={<Categories />} />
            <Route
              path="/settings"
              element={
                <Settings
                  theme={theme}
                  toggleTheme={toggleTheme}
                  setTheme={setTheme}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Task Creation / Edit Modal */}
      <TaskModal />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </BrowserRouter>
  );
}
