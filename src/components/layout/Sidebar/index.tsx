import { useRouter } from "next/router";
import { FC } from "react";

import {
  DiscordIcon,
  GithubIcon,
  PataraIcon,
  PataraStrictIcon,
  TwitterIcon,
} from "@/components/shared/icon";
import useBreakpoint from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";

import { SidebarBadge } from "./Sidebar.components";
import { SIDEBAR_ITEMS } from "./Sidebar.data";

export const Sidebar: FC = () => {
  const router = useRouter();
  const { md, lg } = useBreakpoint();

  return (
    <>
      {md && (
        <nav
          className={cn(
            "flex h-[calc(100vh_-_16px)] max-w-64 flex-col justify-between rounded-2xl bg-custom-gray-50 p-3 lg:w-full lg:p-5",
            "sticky top-2 z-10",
          )}
        >
          <section className="flex flex-col gap-5">
            {lg ? (
              <PataraIcon className="h-12" />
            ) : (
              <PataraStrictIcon className="w-8" />
            )}
            <div className="flex flex-col gap-1">
              {SIDEBAR_ITEMS.map((item) => (
                <SidebarBadge
                  key={item.text}
                  {...item}
                  active={router.isReady && router.pathname === item.href}
                />
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-3 lg:gap-5">
            <div className="flex flex-col items-center justify-center gap-6 fill-custom-dark-blue lg:flex-row lg:items-start lg:justify-normal">
              <a href="https://discord.gg/zHtXawHn6r" target="_blank">
                <DiscordIcon className="h-6 w-6" />
              </a>
              <a href="https://github.com/notus-labs" target="_blank">
                <GithubIcon className="h-6 w-6" />
              </a>
              <a href="https://x.com/PataraApp" target="_blank">
                <TwitterIcon className="h-6 w-6" />
              </a>
            </div>
            {lg && (
              <div className="flex flex-row gap-2 text-xs text-custom-dark-blue">
                <a
                  href="https://patara.app"
                  target="_blank"
                  className="transition-all duration-500 hover:text-primary-500"
                >
                  Terms of Service
                </a>
                <span>·</span>
                <a
                  href="https://patara.app"
                  target="_blank"
                  className="transition-all duration-500 hover:text-primary-500"
                >
                  Privacy Policy
                </a>
              </div>
            )}
          </section>
        </nav>
      )}
    </>
  );
};
