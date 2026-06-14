import { createContext, useContext, useState, type ReactNode } from 'react';

type Page = 'home' | 'foodmap';

interface PageContextType {
  page: Page;
  setPage: (p: Page) => void;
}

const PageContext = createContext<PageContextType | null>(null);

export function PageProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('home');
  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error('usePage must be used within PageProvider');
  return ctx;
}
