import { FC } from "react";

import { cn } from "@/lib/utils";

import { OverviewBadgeProps, OverviewHeaderBadgeProps } from "./Overview.types";

export const OverviewHeaderBadge: FC<OverviewHeaderBadgeProps> = ({
  text,
  percentage,
}) => (
  <div className="rounded-lg bg-custom-gray-100 px-2 py-1 text-xs font-medium text-custom-dark-gray-idk">
    <span>{text}</span>
    <span>
      {" "}
      {typeof percentage === "string" ? percentage : percentage.toFixed(2)}%
    </span>
  </div>
);

export const OverviewBadge: FC<OverviewBadgeProps> = ({
  text,
  onClick,
  active,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-lg bg-custom-gray-50 px-4 py-2 text-sm text-custom-black transition-colors duration-500 hover:bg-primary-500 hover:text-custom-gray-50 lg:text-base",
      active ? "bg-primary-500 text-custom-gray-50" : null,
    )}
  >
    {text}
  </button>
);
