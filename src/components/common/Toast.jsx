import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useTaskContext();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'error') Icon = AlertCircle;

        return (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            role="status"
            aria-live="polite"
          >
            <Icon
              size={18}
              style={{
                color:
                  toast.type === 'success'
                    ? 'var(--color-success)'
                    : toast.type === 'error'
                    ? 'var(--color-danger)'
                    : 'var(--color-primary)',
                flexShrink: 0
              }}
            />
            <span className="toast-message">{toast.message}</span>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
