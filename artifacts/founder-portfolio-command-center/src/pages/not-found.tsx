import { Link } from 'wouter';

export default function NotFound() {
  return <div className="grid min-h-[70dvh] place-items-center"><div className="text-center"><p className="eyebrow text-muted-foreground">404 / off-grid</p><h1 className="mt-3 text-5xl font-extrabold tracking-[-.06em]">That view does not exist.</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">The portfolio map has no route for this location.</p><Link href="/" className="focus-ring mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground" data-testid="link-back-command-center">Return to command center</Link></div></div>;
}