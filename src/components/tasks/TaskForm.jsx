import React, { useState, useEffect } from 'react';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../../utils/taskUtils';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export const TaskForm = ({
  initialValues = null,
  onSubmit,
  onCancel,
  defaultCategory = 'College',
  defaultPriority = 'Medium'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [priority, setPriority] = useState(defaultPriority);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setDescription(initialValues.description || '');
      setCategory(initialValues.category || defaultCategory);
      setPriority(initialValues.priority || defaultPriority);
      setDueDate(initialValues.dueDate || '');
      setDueTime(initialValues.dueTime || '');
      setIsStarred(Boolean(initialValues.isStarred));
    } else {
      setTitle('');
      setDescription('');
      setCategory(defaultCategory);
      setPriority(defaultPriority);
      setDueDate('');
      setDueTime('');
      setIsStarred(false);
    }
    setError('');
  }, [initialValues, defaultCategory, defaultPriority]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required and cannot be empty.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      isStarred
    });
  };

  const isEditing = Boolean(initialValues && initialValues.id);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="modal-body">
        {/* Title */}
        <Input
          label="Task Title"
          id="task-title-input"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. Complete Operating Systems lab assignment"
          error={error}
          required
          autoFocus
        />

        {/* Description */}
        <div className="form-group">
          <label htmlFor="task-desc-input" className="form-label">
            Description <span style={{ color: 'var(--text-tertiary)', textTransform: 'none', fontWeight: 400 }}>(Optional)</span>
          </label>
          <textarea
            id="task-desc-input"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any relevant notes, links, or instructions..."
          />
        </div>

        {/* Category & Priority Row */}
        <div className="form-row">
          <Select
            label="Category"
            id="task-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={TASK_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          />

          <Select
            label="Priority"
            id="task-priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={TASK_PRIORITIES.map((p) => ({ value: p, label: p }))}
          />
        </div>

        {/* Due Date & Time Row */}
        <div className="form-row">
          <Input
            label="Due Date"
            id="task-due-date-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Input
            label="Due Time"
            id="task-due-time-input"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>

        {/* Mark as Important Checkbox */}
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            id="task-star-checkbox"
            type="checkbox"
            checked={isStarred}
            onChange={(e) => setIsStarred(e.target.checked)}
            style={{ width: '17px', height: '17px', accentColor: 'var(--color-primary)' }}
          />
          <label
            htmlFor="task-star-checkbox"
            style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            Mark as Important / Starred
          </label>
        </div>
      </div>

      <div className="modal-footer">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
