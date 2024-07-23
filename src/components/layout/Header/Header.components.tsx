import { ButtonHTMLAttributes, FC } from "react";

import { CaretDown } from "@phosphor-icons/react";
import Skeleton from "react-loading-skeleton";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/context/AppContext";
import useBreakpoint from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";

import { HeaderProfileButtonProps } from "./Header.types";

export const HeaderProfileButton: FC<HeaderProfileButtonProps> = ({
  address,
  avatar,
  avatarFallback,
}) => {
  const { lg } = useBreakpoint();
  const { toggleAccountDrawerOn } = useAppContext();

  return (
    <>
      {lg ? (
        <button
          onClick={() => toggleAccountDrawerOn()}
          className="flex flex-row items-center gap-2 rounded-full bg-custom-gray-100 p-2  py-1 pr-3 dark:bg-custom-dark-700"
        >
          <Avatar className="border-2 border-primary-500 dark:border-primary-300">
            <AvatarImage src={avatar} alt={address} />
            <AvatarFallback className="text-sm font-semibold text-custom-black dark:text-white">
              {avatarFallback || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <div className="text-xs font-bold">Account</div>
            <div className="text-xs text-custom-dark-gray-dropdown dark:text-gray-600">
              {address || <Skeleton width={92} />}
            </div>
          </div>
          <CaretDown className="ml-2 h-6 w-6 text-custom-black dark:text-white " />
        </button>
      ) : (
        <button
          onClick={() => toggleAccountDrawerOn()}
          className="rounded-full"
        >
          <Avatar className="h-10 w-10 border-2 border-primary-500 dark:border-primary-300">
            <AvatarImage src={avatar} alt={address} />
            <AvatarFallback className="text-custom-black dark:text-white">
              {avatarFallback || "AC"}
            </AvatarFallback>
          </Avatar>
        </button>
      )}
    </>
  );
};

export const HeaderButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "rounded-full bg-custom-gray-100 p-2  dark:bg-custom-dark-700 lg:p-3",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
