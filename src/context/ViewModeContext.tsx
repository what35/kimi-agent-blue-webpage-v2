import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ViewModeContextType {
  isGrid: boolean;
  toggleGrid: () => void;
}

const ViewModeContext = createContext<ViewModeContextType>({ isGrid: false, toggleGrid: () => {} });

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [isGrid, setIsGrid] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dt1998_grid') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (isGrid) {
      document.body.classList.add('grid-mode');
      document.body.classList.add('grid-mode-bg');
    } else {
      document.body.classList.remove('grid-mode');
      document.body.classList.remove('grid-mode-bg');
    }
    localStorage.setItem('dt1998_grid', String(isGrid));
  }, [isGrid]);

  const toggleGrid = () => setIsGrid((prev) => !prev);

  return (
    <ViewModeContext.Provider value={{ isGrid, toggleGrid }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  return useContext(ViewModeContext);
}
