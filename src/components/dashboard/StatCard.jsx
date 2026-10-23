import React from 'react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  variant = 'primary',
  subtitle,
  progress = null
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-icon-wrapper stat-icon-${variant}`}>
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div className="stat-card-value">{value}</div>

      {progress !== null && (
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {subtitle && <div className="stat-card-footer">{subtitle}</div>}
    </div>
  );
};
