import { ArrowUpRight, Check, LockKeyhole, TriangleAlert } from 'lucide-react';
import { Link } from 'wouter';
import type { Project } from '@workspace/api-client-react';
import type { ReactNode } from 'react';
import { initials, relativeDate, stageTone, statusTone } from '@/lib/portfolio';

export function StatusPill({ value, stage = false }: { value: string; stage?: boolean }) {
  const tone = stage ? stageTone(value) : statusTone(value);
  const styles = { amber: 'bg-amber-100 text-amber-800 border-amber-200', teal: 'bg-teal-100 text-teal-800 border-teal-200', green: 'bg-emerald-100 text-emerald-800 border-emerald-200', slate: 'bg-secondary text-muted-foreground border-border' };
  return <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[tone]}`} data-testid={`status-${value.toLowerCase().replaceAll(' ', '-')}`}><span className="size-1.5 rounded-full bg-current opacity-70" />{value || 'Unspecified'}</span>;
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow text-muted-foreground">{eyebrow}</p><h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>{description && <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">{description}</p>}</div>{action}</div>;
}

export function StatCard({ label, value, detail, accent = 'default' }: { label: string; value: string | number; detail: string; accent?: 'default' | 'amber' | 'teal' | 'red' }) {
  const bar = { default: 'bg-foreground', amber: 'bg-accent', teal: 'bg-teal-600', red: 'bg-red-600' }[accent];
  return <div className="panel relative overflow-hidden rounded-2xl p-5" data-testid={`stat-${label.toLowerCase().replaceAll(' ', '-')}`}><div className={`absolute inset-y-0 left-0 w-1 ${bar}`} /><p className="eyebrow text-muted-foreground">{label}</p><p className="metric-number mt-3 text-3xl font-extrabold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}

export function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  return <Link href={`/projects/${encodeURIComponent(project.projectId)}`} className={`panel focus-ring group block rounded-2xl transition hover:-translate-y-0.5 hover:border-foreground/25 ${compact ? 'p-4' : 'p-5'}`} data-testid={`card-project-${project.projectId}`}>
    <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-[10px] font-extrabold text-muted-foreground">{initials(project.project)}</div><div className="min-w-0"><p className="truncate text-sm font-extrabold">{project.project}</p><p className="mt-0.5 truncate text-[10px] font-mono-ui text-muted-foreground">{project.projectId}</p></div></div><ArrowUpRight size={15} className="shrink-0 text-muted-foreground transition group-hover:text-foreground" /></div>
    <div className="mt-4 flex flex-wrap items-center gap-2"><StatusPill value={project.lifecycleStage} stage /><StatusPill value={project.status} /></div>
    {!compact && <><div className="mt-5 flex items-end justify-between"><div><p className="eyebrow text-muted-foreground">Level</p><p className="mt-1 text-sm font-extrabold">{project.levelPercent}%</p></div><p className="text-[10px] text-muted-foreground">{relativeDate(project.lastActivity)}</p></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${Math.min(100, project.levelPercent)}%` }} /></div><p className="mt-3 line-clamp-1 text-xs text-muted-foreground">{project.exactNextAction || project.currentGate || 'No next action recorded'}</p></>}
  </Link>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="panel flex min-h-48 flex-col items-center justify-center rounded-2xl p-8 text-center"><div className="grid size-10 place-items-center rounded-xl bg-secondary"><LockKeyhole size={17} className="text-muted-foreground" /></div><h3 className="mt-4 text-sm font-extrabold">{title}</h3><p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{description}</p></div>;
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <div className="panel flex min-h-48 flex-col items-center justify-center rounded-2xl p-8 text-center"><div className="grid size-10 place-items-center rounded-xl bg-red-100 text-red-700"><TriangleAlert size={17} /></div><h3 className="mt-4 text-sm font-extrabold">Portfolio sync unavailable</h3><p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">The tracker could not be reached. Try the sync again before making a decision.</p><button className="focus-ring mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground" onClick={onRetry} data-testid="button-retry">Try again</button></div>;
}

export function LoadingState() {
  return <div className="space-y-6" aria-label="Loading portfolio"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-secondary" />)}</div><div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]"><div className="h-80 animate-pulse rounded-2xl bg-secondary" /><div className="h-80 animate-pulse rounded-2xl bg-secondary" /></div></div>;
}

export function InfoRow({ label, value, icon: Icon = Check }: { label: string; value: string; icon?: typeof Check }) {
  return <div className="flex gap-3 border-b border-border py-3 last:border-0"><Icon size={14} className="mt-0.5 shrink-0 text-muted-foreground" /><div><p className="eyebrow text-muted-foreground">{label}</p><p className="mt-1 text-sm leading-5">{value || 'Not recorded'}</p></div></div>;
}