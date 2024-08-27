import { FC, PropsWithChildren } from "react";

import { useIsClient } from "usehooks-ts";

import { Header, MobileHeader } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

export const Layout: FC<
  PropsWithChildren & {
    roundedFully?: boolean;
    showMobileHeader?: boolean;
    heightFull?: boolean;
    paddingZero?: boolean;
  }
> = ({ children, roundedFully, showMobileHeader, heightFull, paddingZero }) => {
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-row gap-2 pb-1 md:px-2">
      <Sidebar />
      <div className="flex w-full flex-col">
        <Header roundedFully={roundedFully} />
        <main
          className={cn(
            "relative z-0 h-full px-5 md:px-0",
            heightFull && "h-full",
            paddingZero && "px-0 sm:px-5 md:px-0",
          )}
        >
          <MobileHeader show={showMobileHeader} />
          {children}
        </main>
      </div>
    </div>
  );
};
