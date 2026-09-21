import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Dashboard from '@/pages/dashboard';
import Portfolio from '@/pages/portfolio';
import Projects from '@/pages/projects';
import ProjectDetail from '@/pages/project-detail';
import Waiting from '@/pages/waiting';
import BetaLaunch from '@/pages/beta-launch';
import ChangeLog from '@/pages/change-log';
import { AppShell } from '@/components/shell';
import { PortfolioProvider } from '@/lib/portfolio-context';
import { usePortfolioData } from '@/hooks/use-portfolio-data';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  const portfolio = usePortfolioData();
  const value = {
    snapshot: portfolio.data,
    loading: portfolio.isLoading,
    error: portfolio.isError,
    refreshing: portfolio.isFetching,
    refresh: () => { void portfolio.refetch(); },
  };
  return (
    <PortfolioProvider value={value}>
      <AppShell snapshot={portfolio.data} refreshing={portfolio.isFetching} onRefresh={value.refresh}>
        <RoutedErrorBoundary>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/projects" component={Projects} />
            <Route path="/projects/:projectId" component={ProjectDetail} />
            <Route path="/waiting" component={Waiting} />
            <Route path="/beta-launch" component={BetaLaunch} />
            <Route path="/change-log" component={ChangeLog} />
            <Route component={NotFound} />
          </Switch>
        </RoutedErrorBoundary>
      </AppShell>
    </PortfolioProvider>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
