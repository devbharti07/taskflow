import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { getCategoryDistribution } from '../../utils/taskUtils';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem 0.75rem',
          boxShadow: 'var(--shadow-md)',
          fontSize: 'var(--font-size-xs)'
        }}
      >
        <span style={{ color: item.payload.color, fontWeight: 700 }}>
          {item.name}:
        </span>{' '}
        <span style={{ color: 'var(--text-primary)' }}>
          {item.value} {item.value === 1 ? 'task' : 'tasks'}
        </span>
      </div>
    );
  }
  return null;
};

export const CategoryChart = ({ tasks = [] }) => {
  const data = getCategoryDistribution(tasks);

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Categories</h3>
          <p className="card-subtitle">Task breakdown by category</p>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 260, width: '100%' }}>
        {data.length === 0 ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-tertiary)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            No categorized tasks yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  fontSize: 'var(--font-size-xs)',
                  paddingTop: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
