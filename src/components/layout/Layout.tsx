import { FC, PropsWithChildren } from "react";

import { useIsClient } from "usehooks-ts";

import { Header, MobileHeader } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export const Layout: FC<
  PropsWithChildren & {
    roundedFully?: boolean;
    showMobileHeader?: boolean;
  }
> = ({ children, roundedFully, showMobileHeader }) => {
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-row gap-2 pb-2 md:px-2">
      <Sidebar />
      <div className="flex w-full flex-col">
        <Header roundedFully={roundedFully} />
        <main className="relative z-0 px-5 md:px-0">
          <MobileHeader show={showMobileHeader} />
          {children}
        </main>
      </div>
    </div>
  );
};
