import { describe, it, expect } from 'vitest';
import { validateAndParseImportJSON } from '../utils/exportImport';

describe('exportImport validation tests', () => {
  it('rejects empty or non-string inputs', () => {
    expect(validateAndParseImportJSON('').isValid).toBe(false);
    expect(validateAndParseImportJSON(null).isValid).toBe(false);
  });

  it('rejects invalid JSON syntax', () => {
    const res = validateAndParseImportJSON('{ broken json');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('Malformed JSON');
  });

  it('rejects JSON without tasks array', () => {
    const res = validateAndParseImportJSON('{"randomKey": 123}');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('tasks array');
  });

  it('parses valid export object format and normalizes tasks', () => {
    const validJson = JSON.stringify({
      app: 'TaskFlow Pro',
      tasks: [
        {
          title: 'Study Operating Systems',
          category: 'Study',
          priority: 'High',
          dueDate: '2026-11-01'
        }
      ]
    });

    const res = validateAndParseImportJSON(validJson);
    expect(res.isValid).toBe(true);
    expect(res.tasks).toHaveLength(1);
    expect(res.tasks[0].title).toBe('Study Operating Systems');
    expect(res.tasks[0].priority).toBe('High');
    expect(res.tasks[0].status).toBe('pending');
  });

  it('skips invalid items without title', () => {
    const json = JSON.stringify({
      tasks: [
        { title: 'Valid Task' },
        { description: 'Missing title task' }
      ]
    });

    const res = validateAndParseImportJSON(json);
    expect(res.isValid).toBe(true);
    expect(res.tasks).toHaveLength(1);
    expect(res.warning).toContain('skipped');
  });
});
