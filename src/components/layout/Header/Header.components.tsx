import { ButtonHTMLAttributes, FC } from "react";

import { CaretDown } from "@phosphor-icons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useBreakpoint from "@/hooks/useBreakpoint";

import { HeaderProfileButtonProps } from "./Header.types";

export const HeaderProfileButton: FC<HeaderProfileButtonProps> = ({
  address,
  avatar,
  avatarFallback,
  name,
}) => {
  const { lg } = useBreakpoint();
  return (
    <>
      {lg ? (
        <button className="flex flex-row items-center gap-2 rounded-full bg-custom-gray-100 p-2 py-1 pr-3">
          <Avatar className="border-2 border-primary-500">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-custom-black">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <div className="text-sm font-semibold leading-3 text-custom-black">
              {name}
            </div>
            <div className="text-xs text-custom-dark-gray-dropdown">
              {address}
            </div>
          </div>
          <CaretDown className="ml-2 h-6 w-6 text-custom-black" />
        </button>
      ) : (
        <button className="rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary-500">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-custom-black">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
      )}
    </>
  );
};

export const HeaderButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  return (
    <button className="rounded-full bg-custom-gray-100 p-2 lg:p-3" {...props}>
      {children}
    </button>
  );
};
