import React, { useState, useRef } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Sparkles,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { exportTasksToJSON, validateAndParseImportJSON } from '../utils/exportImport';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../utils/taskUtils';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';

export const Settings = ({ theme, toggleTheme, setTheme }) => {
  const {
    tasks,
    settings,
    updateSettings,
    clearAllTasks,
    resetToSampleTasks,
    importTasks,
    addToast
  } = useTaskContext();

  const fileInputRef = useRef(null);

  // Import Modal State
  const [importPreview, setImportPreview] = useState(null);
  const [importMode, setImportMode] = useState('merge'); // 'merge' | 'replace'
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Clear Confirmation Modal State
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Handle Export
  const handleExport = () => {
    const result = exportTasksToJSON(tasks);
    if (result.success) {
      addToast(`Exported ${tasks.length} tasks successfully!`, 'success');
    } else {
      addToast(result.error || 'Failed to export tasks', 'error');
    }
  };

  // Handle File Selected for Import
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const validation = validateAndParseImportJSON(content);

      if (!validation.isValid) {
        addToast(validation.error, 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setImportPreview({
        tasks: validation.tasks,
        fileName: file.name,
        count: validation.tasks.length,
        warning: validation.warning
      });
      setIsImportModalOpen(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.onerror = () => {
      addToast('Error reading the selected JSON file.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (importPreview && importPreview.tasks) {
      importTasks(importPreview.tasks, importMode);
      setIsImportModalOpen(false);
      setImportPreview(null);
    }
  };

  const handleConfirmClear = () => {
    clearAllTasks();
    setIsClearModalOpen(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '820px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SettingsIcon size={22} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Settings & Preferences
          </h2>
        </div>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Configure application theme, default creation preferences, and data persistence
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Appearance Settings */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>
            Theme & Appearance
          </h3>
          <p className="card-subtitle" style={{ marginBottom: '1.25rem' }}>
            Choose your preferred color theme. Changes are saved automatically.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="stat-card"
              onClick={() => setTheme('light')}
              style={{
                flex: '1 1 200px',
                cursor: 'pointer',
                borderColor: theme === 'light' ? 'var(--color-primary)' : 'var(--border-color)',
                boxShadow: theme === 'light' ? '0 0 0 2px var(--color-primary-light)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <Sun size={20} color="#F59E0B" />
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Light Mode</span>
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                Clean, high contrast for bright daylight
              </span>
            </button>

            <button
              type="button"
              className="stat-card"
              onClick={() => setTheme('dark')}
              style={{
                flex: '1 1 200px',
                cursor: 'pointer',
                borderColor: theme === 'dark' ? 'var(--color-primary)' : 'var(--border-color)',
                boxShadow: theme === 'dark' ? '0 0 0 2px var(--color-primary-light)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <Moon size={20} color="#6366F1" />
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Dark Mode</span>
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                Sleek deep navy theme easy on the eyes
              </span>
            </button>
          </div>
        </div>

        {/* Task Defaults */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>
            Task Defaults
          </h3>
          <p className="card-subtitle" style={{ marginBottom: '1.25rem' }}>
            Set standard pre-selected values for newly created tasks
          </p>

          <div className="form-row">
            <Select
              label="Default Priority"
              id="settings-default-priority"
              value={settings.defaultPriority}
              onChange={(e) => updateSettings({ defaultPriority: e.target.value })}
              options={TASK_PRIORITIES.map((p) => ({ value: p, label: `${p} Priority` }))}
            />

            <Select
              label="Default Category"
              id="settings-default-category"
              value={settings.defaultCategory}
              onChange={(e) => updateSettings({ defaultCategory: e.target.value })}
              options={TASK_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />

            <Select
              label="Preferred Task View"
              id="settings-preferred-view"
              value={settings.preferredView}
              onChange={(e) => updateSettings({ preferredView: e.target.value })}
              options={[
                { value: 'grid', label: 'Grid View' },
                { value: 'list', label: 'List View' }
              ]}
            />
          </div>

          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="settings-confetti-checkbox"
              type="checkbox"
              checked={settings.enableConfetti}
              onChange={(e) => updateSettings({ enableConfetti: e.target.checked })}
              style={{ width: '17px', height: '17px', accentColor: 'var(--color-primary)' }}
            />
            <label
              htmlFor="settings-confetti-checkbox"
              style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              Enable celebratory confetti animation when completing tasks
            </label>
          </div>
        </div>

        {/* Data Management (Import & Export) */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>
            Data Persistence & Portability
          </h3>
          <p className="card-subtitle" style={{ marginBottom: '1.25rem' }}>
            Export or import your tasks to maintain backups across devices
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            {/* Export */}
            <Button variant="secondary" icon={Download} onClick={handleExport}>
              Export Tasks as JSON ({tasks.length})
            </Button>

            {/* Import Trigger */}
            <Button
              variant="secondary"
              icon={Upload}
              onClick={() => fileInputRef.current?.click()}
            >
              Import Tasks from JSON
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".json,application/json"
              onChange={handleFileChange}
            />

            {/* Restore Samples */}
            <Button
              variant="ghost"
              icon={RefreshCw}
              onClick={resetToSampleTasks}
              title="Reload initial college and work sample tasks"
            >
              Load Sample Data
            </Button>
          </div>

          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-secondary)'
            }}
          >
            Tasks and user preferences are automatically persisted in your browser's local storage.
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card" style={{ borderColor: 'var(--color-danger)' }}>
          <h3 className="card-title" style={{ color: 'var(--color-danger)', marginBottom: '0.25rem' }}>
            Danger Zone
          </h3>
          <p className="card-subtitle" style={{ marginBottom: '1rem' }}>
            Irreversible actions regarding stored tasks
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                Clear All Taskflow Data
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                Permanently deletes all tasks from LocalStorage.
              </p>
            </div>

            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => setIsClearModalOpen(true)}
              disabled={tasks.length === 0}
            >
              Clear All Tasks
            </Button>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && importPreview && (
        <Modal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          title="Import Tasks from JSON"
          maxWidth="500px"
        >
          <div className="modal-body">
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Found <strong>{importPreview.count} valid tasks</strong> in{' '}
              <code>{importPreview.fileName}</code>.
            </p>

            {importPreview.warning && (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)', marginBottom: '0.75rem' }}>
                {importPreview.warning}
              </p>
            )}

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Import Behavior</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                  />
                  <span>
                    <strong>Merge:</strong> Add new tasks without removing existing ones
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                  />
                  <span>
                    <strong>Replace:</strong> Overwrite all current tasks with imported file
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmImport}>
              Proceed with Import
            </Button>
          </div>
        </Modal>
      )}

      {/* Clear All Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear All Taskflow Data?"
        maxWidth="440px"
      >
        <div className="modal-body" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-danger-light)',
              color: 'var(--color-danger)'
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Are you sure you want to delete all {tasks.length} tasks?
            </p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              All your tasks will be permanently removed from LocalStorage. You can reload sample tasks later if needed.
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setIsClearModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmClear}>
            Yes, Clear All Tasks
          </Button>
        </div>
      </Modal>
    </div>
  );
};
