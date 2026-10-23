import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const EmptyState = ({
  icon: Icon = CheckCircle2,
  title = 'No tasks found',
  description = 'You currently have no tasks matching this view. Enjoy your day or create a new task!',
  actionLabel,
  onAction
}) => {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-icon-wrapper">
        <Icon size={34} strokeWidth={2} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
