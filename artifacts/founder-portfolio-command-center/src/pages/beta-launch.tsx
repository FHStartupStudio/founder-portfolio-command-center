import { ArrowRight, Rocket, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'wouter';
import { useMemo } from 'react';
import { usePortfolioContext } from '@/lib/portfolio-context';
import { EmptyState, ErrorState, LoadingState, SectionHeading } from '@/components/portfolio-ui';
import { groupBy } from '@/lib/portfolio';

export default function BetaLaunch() {
  const { snapshot, loading, error, refresh } = usePortfolioContext();
  const projects = snapshot?.projects || [];
  const betaGroups = useMemo(() => groupBy(projects.filter((project) => project.betaStatus && !/none|not started|n\/a/i.test(project.betaStatus)), (project) => project.betaStatus), [projects]);
  const launchGroups = useMemo(() => groupBy(projects.filter((project) => project.launchStatus && !/none|not started|n\/a/i.test(project.launchStatus)), (project) => project.launchStatus), [projects]);
  if (loading) return <LoadingState />;
  if (error || !snapshot) return <ErrorState onRetry={refresh} />;
  const group = (title: string, icon: LucideIcon, groups: Record<string, typeof projects[number][]>, accent: string) => { const Icon = icon; return <section><SectionHeading eyebrow={title === 'Beta readiness' ? 'Readiness / beta' : 'Readiness / launch'} title={title} description={title === 'Beta readiness' ? 'Signals that an external test can be the next useful move.' : 'Signals that the product can graduate beyond a test.'} /><div className="grid gap-4 lg:grid-cols-2">{Object.entries(groups).map(([name, items]) => <div className="panel rounded-2xl p-5" key={name} data-testid={`readiness-group-${name}`}><div className="flex items-start justify-between gap-3"><div className={`grid size-9 place-items-center rounded-xl ${accent}`}><Icon size={17} /></div><span className="font-mono-ui text-[10px] text-muted-foreground">{items.length} projects</span></div><h3 className="mt-4 text-sm font-extrabold">{name}</h3><div className="mt-4 space-y-2">{items.map((project) => <Link href={`/projects/${encodeURIComponent(project.projectId)}`} className="focus-ring group flex items-center justify-between gap-3 rounded-lg border border-border p-3 hover:bg-secondary/60" key={project.projectId} data-testid={`readiness-project-${project.projectId}`}><div className="min-w-0"><p className="truncate text-xs font-bold">{project.project}</p><p className="mt-1 truncate text-[10px] text-muted-foreground">{project.currentGate || project.exactNextAction}</p></div><ArrowRight size={14} className="shrink-0 text-muted-foreground group-hover:text-foreground" /></Link>)}</div></div>)}</div>{Object.keys(groups).length === 0 && <EmptyState title={`No ${title.toLowerCase()} signals`} description="The readiness tracker has no non-empty groups here yet." />}</section>; };
  return <div className="stagger-in space-y-10"><section><p className="eyebrow text-muted-foreground">Portfolio / readiness board</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Beta to launch, without the fog.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">A grouped view of the projects approaching real-world exposure. Empty groups stay out of the way.</p></section>{group('Beta readiness', Sparkles, betaGroups, 'bg-amber-100 text-amber-800')}{group('Launch readiness', Rocket, launchGroups, 'bg-teal-100 text-teal-800')}</div>;
}