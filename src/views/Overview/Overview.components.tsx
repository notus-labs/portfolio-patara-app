import { FC } from "react";

import { PortfolioAssetCollectibleData } from "@sonarwatch/portfolio-core";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { OverviewBadgeProps, OverviewHeaderBadgeProps } from "./Overview.types";

export const OverviewHeaderBadge: FC<OverviewHeaderBadgeProps> = ({
  text,
  percentage,
}) => (
  <div className="rounded-lg bg-custom-gray-100 px-2  py-1 text-xs font-medium text-custom-dark-gray-idk dark:bg-custom-dark-500">
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
      "rounded-lg bg-custom-gray-50 px-4 py-2 text-sm text-custom-black transition-colors  duration-500 hover:bg-primary-500 hover:text-custom-gray-50 dark:bg-custom-dark-700 dark:text-custom-gray-600 hover:dark:bg-primary-300  hover:dark:text-white lg:text-base",
      active
        ? "bg-primary-500 text-custom-gray-50 dark:bg-primary-300 dark:text-white "
        : null,
    )}
  >
    {text}
  </button>
);

export const OverviewNFTCard: FC<{ nft: PortfolioAssetCollectibleData }> = ({
  nft,
}) => (
  <>
    {nft.name && (
      <div className="flex flex-col gap-3 rounded-lg bg-custom-gray-50 p-3  dark:bg-custom-dark-800">
        {/* Square image and contain */}
        <div>
          <Avatar className="aspect-square h-full w-full rounded-none object-contain">
            <AvatarImage src={nft.imageUri} alt={nft.name} />
            <AvatarFallback className="rounded-none border border-black text-custom-black dark:text-white ">
              NFT
            </AvatarFallback>
          </Avatar>
        </div>
        <h4 className="text-sm font-medium text-custom-black dark:text-white ">
          {nft.name}
        </h4>
      </div>
    )}
  </>
);

export const OverviewContentBadge: FC<{ text: string }> = ({ text }) => (
  <div className="rounded-lg bg-custom-gray-100 px-3  py-1 text-xs font-medium capitalize text-custom-dark-gray-idk dark:bg-custom-dark-700 dark:text-gray-600">
    {text}
  </div>
);
