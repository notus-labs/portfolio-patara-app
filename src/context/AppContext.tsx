import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AppContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const AppContext = createContext<AppContextType>({
  isSidebarOpen: false,
  toggleSidebar: () => {
    throw new Error("AppContextProvider not initialized");
  },
});

export const useAppContext = () => useContext(AppContext);

export function AppContextProvider({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ isSidebarOpen, toggleSidebar }),
    [isSidebarOpen, toggleSidebar],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
