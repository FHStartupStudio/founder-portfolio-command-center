import { useGetPortfolio, getGetPortfolioQueryKey } from '@workspace/api-client-react';

export function usePortfolioData() {
  return useGetPortfolio({ query: { queryKey: getGetPortfolioQueryKey(), staleTime: 30_000 } });
}