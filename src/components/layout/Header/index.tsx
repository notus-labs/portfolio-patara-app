import { FC } from "react";

import { Gear, List } from "@phosphor-icons/react";
import { useWindowScroll } from "@uidotdev/usehooks";

import { PataraIcon } from "@/components/shared/icon";
import { useAppContext } from "@/context/AppContext";
import useBreakpoint from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";

import { HeaderButton, HeaderProfileButton } from "./Header.components";

export const Header: FC = () => {
  const location = "Overview";
  const avatar =
    "https://media.licdn.com/dms/image/D4D03AQEQfLcKFEo2bw/profile-displayphoto-shrink_200_200/0/1664445995349?e=1719446400&v=beta&t=Hzb-FR92rvAamElYCvSzJiz9VftECWVT3_iYH8vL8NY";
  const avatarFallback = "MK";
  const address = "0x1234..cdef";
  const name = "mehmet.eth";

  const [{ y }] = useWindowScroll();
  const { lg } = useBreakpoint();
  const { toggleSidebar } = useAppContext();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-20 bg-custom-gray-200 lg:h-24",
        y && y > 96 && y <= 150 && "lg:rounded-b-2xl",
        !lg && y && y > 1 && "border-b border-custom-gray-100",
      )}
    >
      {lg ? (
        <div
          className={cn(
            "absolute top-2 flex w-full flex-row items-center justify-between rounded-t-2xl bg-custom-gray-50 p-3 lg:p-5",
            y && y > 96 && "rounded-b-2xl",
          )}
        >
          <h2 className="text-2xl font-semibold text-custom-black">
            {location}
          </h2>
          <div className="flex flex-row gap-2">
            <HeaderButton>
              <Gear className="h-6 w-6 text-custom-black" />
            </HeaderButton>
            <HeaderProfileButton
              address={address}
              avatar={avatar}
              avatarFallback={avatarFallback}
              name={name}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-between p-5 pb-3">
          <PataraIcon />
          <div className="flex flex-row items-center gap-2">
            <HeaderProfileButton
              address={address}
              avatar={avatar}
              avatarFallback={avatarFallback}
              name={name}
            />
            <HeaderButton onClick={toggleSidebar}>
              <List className="h-6 w-6 text-custom-black" />
            </HeaderButton>
          </div>
        </div>
      )}
    </header>
  );
};

export const MobileHeader: FC = () => {
  const location = "Overview";
  const { lg } = useBreakpoint();

  return (
    <>
      {!lg && (
        <div
          className={cn(
            "flex w-full flex-row items-center justify-between rounded-t-2xl bg-custom-gray-50 p-5 pb-0",
          )}
        >
          <h2 className="text-2xl font-semibold text-custom-black">
            {location}
          </h2>
        </div>
      )}
    </>
  );
};
