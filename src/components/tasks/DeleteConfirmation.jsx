import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const DeleteConfirmation = ({
  isOpen,
  task,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete Task" maxWidth="440px">
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
            Are you sure you want to permanently delete this task?
          </p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            "{task.title}" will be permanently removed. This action cannot be undone.
          </p>
        </div>
      </div>
      <div className="modal-footer">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => onConfirm(task.id)}>
          Delete Task
        </Button>
      </div>
    </Modal>
  );
};
