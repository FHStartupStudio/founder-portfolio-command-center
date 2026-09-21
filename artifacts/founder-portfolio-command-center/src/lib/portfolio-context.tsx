import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { PortfolioSnapshot } from '@workspace/api-client-react';

type PortfolioContextValue = { snapshot?: PortfolioSnapshot; loading: boolean; error: boolean; refreshing: boolean; refresh: () => void };
const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ value, children }: { value: PortfolioContextValue; children: ReactNode }) {
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolioContext() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolioContext must be used inside PortfolioProvider');
  return context;
}