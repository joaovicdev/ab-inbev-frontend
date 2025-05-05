import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const wrapper = ({ children }: { children: React.ReactNode }) => {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
