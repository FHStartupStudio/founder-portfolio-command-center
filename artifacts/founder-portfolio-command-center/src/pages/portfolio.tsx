import { ArrowRight, Layers3 } from 'lucide-react';
import { Link, useLocation, useRoute } from 'wouter';
import { useMemo } from 'react';
import { usePortfolioContext } from '@/lib/portfolio-context';
import { EmptyState, ErrorState, FamilyProjectCard, LoadingState, SectionHeading, StatCard, StatusPill } from '@/components/portfolio-ui';
import { groupBy, uniqueValues } from '@/lib/portfolio';

export default function Portfolio() {
  const { snapshot, loading, error, refresh } = usePortfolioContext();
  const [location, setLocation] = useLocation();
  const [familyMatch, familyParams] = useRoute('/portfolio/family/:family');
  const projects = snapshot?.projects || [];
  const queryFamily = new URLSearchParams(location.split('?')[1] || '').get('family') || '';
  const selectedFamily = familyMatch && familyParams?.family ? decodeURIComponent(familyParams.family) : queryFamily;
  const groups = useMemo(() => groupBy(projects, (project) => project.portfolioFamily), [projects]);
  const selectedProjects = selectedFamily ? projects.filter((project) => project.portfolioFamily === selectedFamily) : [];
  const statusSummary = useMemo(() => Object.entries(groupBy(selectedProjects, (project) => project.status)), [selectedProjects]);
  const stageSummary = useMemo(() => Object.entries(groupBy(selectedProjects, (project) => project.lifecycleStage)), [selectedProjects]);
  const averageLevel = selectedProjects.length
    ? Math.round(selectedProjects.reduce((sum, project) => sum + project.levelPercent, 0) / selectedProjects.length)
    : 0;

  if (loading) return <LoadingState />;
  if (error || !snapshot) return <ErrorState onRetry={refresh} />;
  return <div className="stagger-in space-y-8">
    <section className="flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow text-muted-foreground">Portfolio / systems map</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Families, not a flat list.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">A portfolio-level view of the bets in motion, grouped by the operating family they belong to.</p></div><div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs"><Layers3 size={15} /><span className="font-bold">{Object.keys(groups).length} families</span></div></section>
     {selectedFamily ? <section>
       <button className="focus-ring mb-5 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground" onClick={() => setLocation('/portfolio')} data-testid="button-clear-family"><ArrowRight size={14} className="rotate-180" /> All families</button>
       <SectionHeading eyebrow="Family drill-down" title={selectedFamily} description={`${selectedProjects.length} projects assigned to this portfolio family.`} />
       <div className="grid gap-4 sm:grid-cols-3">
         <StatCard label="Projects" value={selectedProjects.length} detail="Live sheet records in family" />
         <StatCard label="Average level" value={`${averageLevel}%`} detail="Mean Level % from sheet" accent="teal" />
         <StatCard label="Status groups" value={statusSummary.length} detail="Distinct current statuses" accent="amber" />
       </div>
       <div className="mt-6 grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
         <div className="panel rounded-2xl p-5">
           <p className="eyebrow text-muted-foreground">Status summary</p>
           <div className="mt-4 space-y-3">
             {statusSummary.map(([status, items]) => <div className="flex items-center justify-between gap-3" key={status}><StatusPill value={status} /><span className="text-sm font-extrabold">{items.length}</span></div>)}
           </div>
         </div>
         <div className="panel rounded-2xl p-5">
           <p className="eyebrow text-muted-foreground">Lifecycle stage summary</p>
           <div className="mt-4 flex flex-wrap gap-2">
             {stageSummary.map(([stage, items]) => <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2" key={stage}><StatusPill value={stage} stage /><span className="text-xs font-extrabold">{items.length}</span></div>)}
           </div>
         </div>
       </div>
       <div className="mt-8">
         <SectionHeading eyebrow="Projects in family" title="Every assigned project" description="Select a project to open the full tracker record." />
         {selectedProjects.length > 0 ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{selectedProjects.map((project) => <FamilyProjectCard key={project.projectId} project={project} />)}</div> : <EmptyState title="Family not found" description="This family is not present in the latest Google Sheet snapshot." />}
       </div>
     </section> : <><section className="grid gap-4 sm:grid-cols-3"><StatCard label="Families" value={Object.keys(groups).length} detail="Distinct portfolio systems" /><StatCard label="Largest family" value={Math.max(...Object.values(groups).map((items) => items.length), 0)} detail="Projects in one family" accent="amber" /><StatCard label="Coverage" value={`${uniqueValues(projects, 'category').length}`} detail="Product categories represented" accent="teal" /></section><section><SectionHeading eyebrow="Portfolio families" title="Choose a family to inspect" description="Each family is a focused surface for deciding what to advance, pause, or finish." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Object.entries(groups).map(([family, items]) => { const avg = Math.round(items.reduce((sum, project) => sum + project.levelPercent, 0) / items.length); return <Link href={`/portfolio/family/${encodeURIComponent(family)}`} key={family} className="panel focus-ring group block rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-foreground/25" aria-label={`Open ${family} family`} data-testid={`card-family-${family}`}><div className="flex items-start justify-between"><div className="grid size-10 place-items-center rounded-xl bg-secondary"><Layers3 size={18} /></div><ArrowRight size={16} className="text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" /></div><h3 className="mt-6 text-lg font-extrabold tracking-tight">{family}</h3><div className="mt-5 flex items-end justify-between"><div><p className="eyebrow text-muted-foreground">Projects</p><p className="mt-1 text-xl font-extrabold">{items.length}</p></div><div className="text-right"><p className="eyebrow text-muted-foreground">Avg level</p><p className="mt-1 text-xl font-extrabold">{avg}%</p></div></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-accent" style={{ width: `${avg}%` }} /></div><div className="mt-4 flex flex-wrap gap-1.5">{Array.from(new Set(items.map((item) => item.lifecycleStage))).slice(0, 3).map((stage) => <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground" key={stage}>{stage}</span>)}</div></Link>; })}</div>{Object.keys(groups).length === 0 && <EmptyState title="No portfolio families yet" description="Once the tracker returns projects, the family map will appear here." />}</section></>}
  </div>;
}