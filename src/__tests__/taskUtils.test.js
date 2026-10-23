import { describe, it, expect } from 'vitest';
import {
  calculateTaskStats,
  filterTasks,
  sortTasks,
  getCategoryDistribution
} from '../utils/taskUtils';

describe('taskUtils tests', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Finish Physics Assignment',
      description: 'Electrostatics problem set',
      category: 'College',
      priority: 'High',
      status: 'pending',
      dueDate: '2026-10-23',
      dueTime: '23:59',
      isStarred: true,
      createdAt: '2026-10-20T10:00:00Z',
      completedAt: null
    },
    {
      id: '2',
      title: 'Workout at gym',
      description: 'Leg day routine',
      category: 'Personal',
      priority: 'Low',
      status: 'completed',
      dueDate: '2026-10-22',
      dueTime: '08:00',
      isStarred: false,
      createdAt: '2026-10-21T10:00:00Z',
      completedAt: '2026-10-22T09:00:00Z'
    },
    {
      id: '3',
      title: 'Database Design Milestone',
      description: 'Write DDL statements',
      category: 'Projects',
      priority: 'Medium',
      status: 'pending',
      dueDate: '2025-01-01', // definitely overdue
      dueTime: '12:00',
      isStarred: false,
      createdAt: '2024-12-01T10:00:00Z',
      completedAt: null
    }
  ];

  it('calculates task statistics accurately', () => {
    const stats = calculateTaskStats(mockTasks);
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(2);
    expect(stats.overdue).toBe(1);
    expect(stats.starredCount).toBe(1);
    expect(stats.completionRate).toBe(33);
  });

  it('filters tasks by search string matching title or description', () => {
    const byTitle = filterTasks(mockTasks, { search: 'physics' });
    expect(byTitle).toHaveLength(1);
    expect(byTitle[0].id).toBe('1');

    const byDesc = filterTasks(mockTasks, { search: 'DDL' });
    expect(byDesc).toHaveLength(1);
    expect(byDesc[0].id).toBe('3');

    const empty = filterTasks(mockTasks, { search: 'nonexistent query' });
    expect(empty).toHaveLength(0);
  });

  it('filters tasks by category', () => {
    const collegeOnly = filterTasks(mockTasks, { category: 'College' });
    expect(collegeOnly).toHaveLength(1);
    expect(collegeOnly[0].category).toBe('College');
  });

  it('filters tasks by priority', () => {
    const highOnly = filterTasks(mockTasks, { priority: 'High' });
    expect(highOnly).toHaveLength(1);
    expect(highOnly[0].priority).toBe('High');
  });

  it('sorts tasks by priority High -> Medium -> Low', () => {
    const sorted = sortTasks(mockTasks, 'priority');
    expect(sorted[0].priority).toBe('High');
    expect(sorted[1].priority).toBe('Medium');
    expect(sorted[2].priority).toBe('Low');
  });

  it('sorts tasks by title alphabetically', () => {
    const sorted = sortTasks(mockTasks, 'title');
    expect(sorted[0].title).toBe('Database Design Milestone');
    expect(sorted[1].title).toBe('Finish Physics Assignment');
    expect(sorted[2].title).toBe('Workout at gym');
  });

  it('computes category distribution', () => {
    const dist = getCategoryDistribution(mockTasks);
    expect(dist.some((d) => d.name === 'College' && d.value === 1)).toBe(true);
    expect(dist.some((d) => d.name === 'Personal' && d.value === 1)).toBe(true);
    expect(dist.some((d) => d.name === 'Projects' && d.value === 1)).toBe(true);
  });
});
