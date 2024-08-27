import { useRouter } from "next/router";
import { FC } from "react";

import { Gear, List } from "@phosphor-icons/react";
import { useWindowScroll } from "@uidotdev/usehooks";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { PataraIcon } from "@/components/shared/icon";
import { useAppContext } from "@/context/AppContext";
import { useWalletContext } from "@/context/WalletContext";
import useBreakpoint from "@/hooks/useBreakpoint";
import { formatAddress } from "@/lib/format";
import { cn } from "@/lib/utils";

import { SIDEBAR_ITEMS } from "../Sidebar/Sidebar.data";

import { HeaderButton, HeaderProfileButton } from "./Header.components";

export const Header: FC<{
  roundedFully?: boolean;
}> = ({ roundedFully = false }) => {
  const router = useRouter();
  const { account, address } = useWalletContext();
  const location = SIDEBAR_ITEMS.find(
    (item) => item.href === router.pathname,
  )?.text;
  const avatar = account?.icon || "";
  const avatarFallback = "A";
  const formattedAddress = address ? formatAddress(address) : "";

  const [{ y }] = useWindowScroll();
  const { md, lg } = useBreakpoint();
  const { toggleSidebarOn } = useAppContext();
  const { setTheme } = useTheme();

  return (
    <header
      className={cn(
        "sticky left-0 top-0 z-50 h-20 bg-custom-gray-200 dark:bg-custom-dark-900  lg:h-24",
        y && y > 96 && y <= 150 && "lg:rounded-b-2xl",
        !md &&
          y &&
          y > 1 &&
          "border-b border-custom-gray-100 dark:border-custom-dark-500 ",
      )}
    >
      {md ? (
        <div
          className={cn(
            "absolute top-2 flex w-full flex-row items-center justify-between rounded-t-2xl bg-custom-gray-50 p-3  dark:bg-custom-dark-800 lg:p-5",
            y && y > 96 && "rounded-b-2xl",
            roundedFully && "rounded-b-2xl",
            md && !lg && "rounded-b-2xl",
          )}
        >
          <h2 className="text-2xl font-semibold text-custom-black dark:text-white ">
            {location}
          </h2>
          <div className="flex flex-row gap-2">
            <HeaderButton
              onClick={() => {
                toast.info("Settings are not available yet.");
              }}
            >
              <Gear className="h-6 w-6 text-custom-black dark:text-white " />
            </HeaderButton>
            <HeaderButton
              className="hidden dark:block"
              onClick={() => {
                setTheme("light");
              }}
            >
              <Sun className="h-6 w-6 text-custom-black dark:text-white" />
            </HeaderButton>
            <HeaderButton
              onClick={() => {
                setTheme("dark");
              }}
              className="dark:hidden"
            >
              <Moon className="h-6 w-6 text-custom-black dark:text-white" />
            </HeaderButton>
            <HeaderProfileButton
              address={formattedAddress}
              avatar={avatar}
              avatarFallback={avatarFallback}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-between p-5 pb-3">
          <PataraIcon />
          <div className="flex flex-row items-center gap-2">
            <HeaderProfileButton
              address={formattedAddress}
              avatar={avatar}
              avatarFallback={avatarFallback}
            />
            <HeaderButton
              className="hidden dark:block"
              onClick={() => {
                setTheme("light");
              }}
            >
              <Sun className="h-6 w-6 text-custom-black dark:text-white" />
            </HeaderButton>
            <HeaderButton
              onClick={() => {
                setTheme("dark");
              }}
              className="dark:hidden"
            >
              <Moon className="h-6 w-6 text-custom-black dark:text-white" />
            </HeaderButton>
            <HeaderButton onClick={toggleSidebarOn}>
              <List className="h-6 w-6 text-custom-black dark:text-white " />
            </HeaderButton>
          </div>
        </div>
      )}
    </header>
  );
};

export const MobileHeader: FC<{
  show?: boolean;
}> = ({ show }) => {
  const location = "Overview";
  const { lg } = useBreakpoint();

  return (
    <>
      {!lg && show && (
        <div
          className={cn(
            "flex w-full flex-row items-center justify-between rounded-t-2xl bg-custom-gray-50 p-5  pb-0 dark:bg-custom-dark-800",
          )}
        >
          <h2 className="text-2xl font-semibold text-custom-black dark:text-white ">
            {location}
          </h2>
        </div>
      )}
    </>
  );
};
