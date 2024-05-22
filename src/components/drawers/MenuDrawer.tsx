import { useRouter } from "next/router";

import { SIDEBAR_ITEMS } from "@/components/layout/Sidebar/Sidebar.data";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAppContext } from "@/context/AppContext";

import { SidebarBadge } from "../layout/Sidebar/Sidebar.components";
import {
  DiscordIcon,
  GithubIcon,
  PataraIcon,
  TwitterIcon,
} from "../shared/icon";

export const MenuDrawer = () => {
  const router = useRouter();
  const { isSidebarOpen, toggleSidebarOff } = useAppContext();

  return (
    <Drawer direction="right" open={isSidebarOpen} onClose={toggleSidebarOff}>
      <DrawerContent
        onClose={toggleSidebarOff}
        className="left-auto h-full w-56 rounded-bl-2xl rounded-br-none rounded-tl-2xl rounded-tr-none"
      >
        <DrawerHeader>
          <DrawerTitle>
            <PataraIcon className="h-12" />
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-1 pl-5">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarBadge
              key={item.text}
              {...item}
              active={router.isReady && router.pathname === item.href}
            />
          ))}
        </div>
        <DrawerFooter className="pl-5">
          <div className="flex flex-row items-start justify-normal gap-6 fill-custom-dark-blue">
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
