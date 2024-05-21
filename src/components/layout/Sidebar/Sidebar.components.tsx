import Link from "next/link";
import { FC, cloneElement } from "react";

import { cn } from "@/lib/utils";

import { SidebarItem } from "./Sidebar.types";

export const SidebarBadge: FC<SidebarItem> = ({ icon, text, active, href }) => {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-row items-center justify-center gap-4 py-2 text-sm font-medium text-custom-dark-blue transition-colors duration-500 hover:text-primary-500 lg:justify-normal",
        active ? "text-primary-500" : null,
      )}
    >
      {cloneElement(icon as React.ReactElement, {
        className: cn(
          "h-6 w-6 text-custom-dark-blue group-hover:text-primary-500 transition-colors duration-500",
          active ? "text-primary-500" : null,
        ),
        weight: active ? "fill" : "regular",
      })}
      <div className="hidden lg:block">{text}</div>
    </Link>
  );
};
