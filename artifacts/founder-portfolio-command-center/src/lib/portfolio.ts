import type { ChangeLogEntry, PortfolioSnapshot, Project } from '@workspace/api-client-react';

export type SortKey = 'activity' | 'level' | 'name' | 'family';

export const stageOrder = ['Idea', 'Build', 'Validate', 'Beta', 'Launch', 'Live'];

export function formatDate(value: string, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  }).format(date);
}

export function relativeDate(value: string) {
  const date = new Date(value).getTime();
  if (Number.isNaN(date)) return value || 'No activity';
  const days = Math.floor((Date.now() - date) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDate(value);
}

export function uniqueValues(projects: Project[], key: keyof Project) {
  return Array.from(new Set(projects.map((project) => String(project[key] || '')).filter(Boolean))).sort();
}

export function groupBy<T>(items: T[], key: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const group = key(item) || 'Unassigned';
    (groups[group] ||= []).push(item);
    return groups;
  }, {});
}

export function initials(value: string) {
  return value.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

export function statusTone(status: string) {
  const value = status.toLowerCase();
  if (value.includes('waiting') || value.includes('blocked')) return 'amber';
  if (value.includes('active') || value.includes('progress') || value.includes('working')) return 'teal';
  if (value.includes('complete') || value.includes('live') || value.includes('ready')) return 'green';
  return 'slate';
}

export function stageTone(stage: string) {
  const value = stage.toLowerCase();
  if (value.includes('beta') || value.includes('launch')) return 'amber';
  if (value.includes('live')) return 'green';
  if (value.includes('validate')) return 'teal';
  return 'slate';
}

export function getSnapshot(data: PortfolioSnapshot | undefined) {
  return data;
}

export type { ChangeLogEntry, PortfolioSnapshot, Project };