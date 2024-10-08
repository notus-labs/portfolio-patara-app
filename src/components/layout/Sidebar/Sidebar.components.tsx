import Link from "next/link";
import { FC, cloneElement } from "react";

import { cn } from "@/lib/utils";

import { SidebarItem } from "./Sidebar.types";

export const SidebarBadge: FC<SidebarItem> = ({
  icon,
  text,
  active,
  href,
  activated,
}) => {
  return (
    <>
      {activated ? (
        <Link
          href={href}
          className={cn(
            "group flex flex-row items-center gap-4 py-2 text-sm font-medium text-custom-dark-blue transition-colors duration-500 hover:text-primary-500 dark:text-white dark:hover:text-primary-300 md:justify-center lg:justify-normal",
            active ? "text-primary-500 dark:text-primary-300" : null,
          )}
        >
          {cloneElement(icon as React.ReactElement, {
            className: cn(
              "h-6 w-6 text-custom-dark-blue dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-300 transition-colors duration-500",
              active ? "text-primary-500 dark:text-primary-300" : null,
            ),
            weight: active ? "fill" : "regular",
          })}
          <div className="md:hidden lg:block">{text}</div>
        </Link>
      ) : (
        <div
          className={cn(
            "group flex cursor-not-allowed flex-row items-center gap-4 py-2 text-sm font-medium text-custom-dark-blue opacity-50 transition-colors duration-500 dark:text-white md:justify-center lg:justify-normal",
          )}
        >
          {cloneElement(icon as React.ReactElement, {
            className: cn(
              "h-6 w-6 text-custom-dark-blue dark:text-white transition-colors duration-500",
            ),
          })}
          <div className="md:hidden lg:block">{text}</div>
        </div>
      )}
    </>
  );
};
