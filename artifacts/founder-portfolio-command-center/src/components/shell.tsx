import { Bell, ChevronRight, CircleHelp, LayoutDashboard, Menu, Network, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { PortfolioSnapshot } from '@workspace/api-client-react';
import { formatDate } from '@/lib/portfolio';

type ShellProps = { children: ReactNode; snapshot?: PortfolioSnapshot; refreshing?: boolean; onRefresh: () => void };

const navItems = [
  { href: '/', label: 'Command center', caption: 'Overview', icon: LayoutDashboard },
  { href: '/portfolio', label: 'Portfolio', caption: 'Families & systems', icon: Network },
  { href: '/projects', label: 'All projects', caption: 'Search & sort', icon: SlidersHorizontal },
  { href: '/waiting', label: 'Waiting on gate', caption: 'Needs a decision', icon: CircleHelp },
  { href: '/beta-launch', label: 'Beta & launch', caption: 'Readiness board', icon: Bell },
  { href: '/change-log', label: 'Change log', caption: 'Recent movement', icon: RefreshCw },
];

export function AppShell({ children, snapshot, refreshing, onRefresh }: ShellProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const live = snapshot?.mode === 'LIVE DATA';

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-6">
          <Link href="/" className="focus-ring flex items-center gap-3" data-testid="link-brand">
            <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sm font-extrabold text-sidebar-primary-foreground">FP</span>
            <span><span className="block text-sm font-extrabold tracking-tight">Founder OS</span><span className="eyebrow mt-1 block text-sidebar-foreground/55">Portfolio command center</span></span>
          </Link>
          <button className="focus-ring rounded-md p-1.5 text-sidebar-foreground/55 hover:bg-sidebar-accent lg:hidden" onClick={() => setMobileOpen(false)} data-testid="button-close-mobile-nav" aria-label="Close navigation"><X size={17} /></button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Primary navigation">
          <p className="eyebrow mb-3 px-3 text-sidebar-foreground/40">Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === '/' ? location === '/' : location.startsWith(item.href);
            return <Link href={item.href} key={item.href} onClick={() => setMobileOpen(false)} className={`focus-ring group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${active ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'}`} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
              <span className={`grid size-8 place-items-center rounded-lg ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-sidebar-foreground/5 text-sidebar-foreground/55 group-hover:text-sidebar-foreground'}`}><Icon size={16} strokeWidth={1.8} /></span>
              <span className="min-w-0"><span className="block truncate text-[13px] font-semibold">{item.label}</span><span className="mt-0.5 block truncate text-[10px] text-sidebar-foreground/40">{item.caption}</span></span>
              {active && <ChevronRight size={14} className="ml-auto text-sidebar-primary" />}
            </Link>;
          })}
        </nav>
        <div className="border-t border-sidebar-border px-5 py-5">
          <div className="mb-4 rounded-xl border border-sidebar-border bg-sidebar-accent/45 p-3">
            <div className="flex items-center justify-between"><span className="eyebrow text-sidebar-foreground/45">Data source</span><span className="size-1.5 rounded-full bg-primary" /></div>
            <p className="mt-2 text-xs font-semibold">{live ? 'Live tracker' : 'Sample mode'}</p>
            <p className="mt-1 text-[10px] leading-4 text-sidebar-foreground/45">{snapshot?.syncedAt ? `Synced ${formatDate(snapshot.syncedAt, true)}` : 'Waiting for first sync'}</p>
          </div>
          <div className="flex items-center gap-3"><div className="grid size-8 place-items-center rounded-full bg-sidebar-primary text-[11px] font-extrabold text-sidebar-primary-foreground">FO</div><div><p className="text-xs font-bold">Founder view</p><p className="text-[10px] text-sidebar-foreground/45">Internal Workspace</p></div></div>
        </div>
      </aside>

      {mobileOpen && <button className="fixed inset-0 z-30 bg-sidebar/45 lg:hidden" onClick={() => setMobileOpen(false)} data-testid="button-dismiss-mobile-nav" aria-label="Dismiss navigation" />}
      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-8">
           <div className="flex items-center gap-3"><button className="focus-ring rounded-lg border border-border bg-card p-2 lg:hidden" onClick={() => setMobileOpen(true)} data-testid="button-open-mobile-nav" aria-label="Open navigation"><Menu size={17} /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span className="font-mono-ui text-[11px]">FOUNDER OS</span><ChevronRight size={13} /><span className="font-semibold text-foreground">{navItems.find((item) => item.href === '/' ? location === '/' : location.startsWith(item.href))?.label || 'Workspace'}</span></div></div>
          <div className="flex items-center gap-2 sm:gap-4">
            <label className="relative hidden md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} /><input className="focus-ring h-9 w-48 rounded-lg border border-border bg-card pl-9 pr-3 text-xs outline-none placeholder:text-muted-foreground/70" placeholder="Search projects..." data-testid="input-global-search" /></label>
            <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 sm:flex"><span className="size-1.5 rounded-full bg-primary" /><span className="font-mono-ui text-[10px] font-medium">{live ? 'LIVE DATA' : 'SAMPLE MODE'}</span></div>
            <button className="focus-ring inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-bold transition hover:border-foreground/30 disabled:opacity-50" onClick={onRefresh} disabled={refreshing} data-testid="button-refresh"><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /><span className="hidden sm:inline">{refreshing ? 'Syncing' : 'Refresh'}</span></button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}