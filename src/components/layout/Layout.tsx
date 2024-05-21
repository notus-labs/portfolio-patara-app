import { FC, PropsWithChildren } from "react";

import { useIsClient } from "usehooks-ts";

import { Header, MobileHeader } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-row gap-2 px-0 pb-2 lg:px-2">
      <Sidebar />
      <div className="flex w-full flex-col">
        <Header />
        <main className="px-5 lg:px-0">
          <MobileHeader />
          {children}
        </main>
      </div>
    </div>
  );
};
