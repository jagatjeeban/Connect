import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';

//import components
import ContactsQueryLifecycle from '@/features/contacts/contacts-query-lifecycle';

//query client
const queryClient = new QueryClient();

/**
 * Provides the application with one shared, memory-only TanStack Query client.
 */
const AppQueryProvider = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <ContactsQueryLifecycle />
    {children}
  </QueryClientProvider>
);

export default AppQueryProvider;
