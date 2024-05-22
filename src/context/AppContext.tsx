import { PropsWithChildren, createContext, useContext, useState } from "react";

type AppContextType = {
  isSidebarOpen: boolean;
  toggleSidebarOff: () => void;
  toggleSidebarOn: () => void;
};

const AppContext = createContext<AppContextType>({
  isSidebarOpen: false,
  toggleSidebarOff: () => {},
  toggleSidebarOn: () => {},
});

export const useAppContext = () => useContext(AppContext);

export function AppContextProvider({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebarOff = () => setIsSidebarOpen(false);
  const toggleSidebarOn = () => setIsSidebarOpen(true);

  const value = {
    isSidebarOpen,
    toggleSidebarOff,
    toggleSidebarOn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
