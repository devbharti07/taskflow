import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { getWeeklyProductivityData } from '../../utils/taskUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 0.85rem',
          boxShadow: 'var(--shadow-md)',
          fontSize: 'var(--font-size-xs)'
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <p key={`tooltip-${index}`} style={{ color: entry.color, fontWeight: 500 }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ProductivityChart = ({ tasks = [] }) => {
  const data = getWeeklyProductivityData(tasks);
  const totalActivity = data.reduce((acc, curr) => acc + curr.Completed + curr.Created, 0);

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">Weekly Productivity</h3>
          <p className="card-subtitle">Tasks created vs completed over the last 7 days</p>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 260, width: '100%' }}>
        {totalActivity === 0 && tasks.length === 0 ? (
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
            No task activity in the last 7 days.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="var(--text-secondary)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="var(--text-secondary)"
                fontSize={12}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: 10,
                  fontSize: 'var(--font-size-xs)'
                }}
              />
              <Bar dataKey="Created" fill="#818CF8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
