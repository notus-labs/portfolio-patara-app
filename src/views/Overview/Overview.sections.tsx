import Skeleton from "react-loading-skeleton";

import { usePortfolio } from "@/hooks/usePortfolio";

import { OverviewBadge } from "./Overview.components";
import { BADGES, Badges } from "./Overview.types";

export const OverviewHeader = () => {
  const { data, isLoading } = usePortfolio();

  return (
    <section className="flex w-full flex-col gap-3 rounded-b-2xl bg-custom-gray-50 p-5  pt-3 dark:bg-custom-dark-800 lg:pt-5">
      <div className="flex flex-col gap-1 text-custom-black dark:text-white ">
        <h3 className="text-sm font-medium lg:text-base">Net Worth</h3>
        <h1 className="text-2xl font-semibold lg:text-2.5xl">
          {isLoading ? (
            <Skeleton width={200} />
          ) : (
            <>{data?.value?.toFixed(2)} USD</>
          )}
        </h1>
      </div>

      {/* 
        //TODO: Commented out until we have our own solution
        <div className="flex flex-row gap-2">
          <OverviewHeaderBadge text="Coins" percentage={74.6} />
          <OverviewHeaderBadge text="NFTs" percentage={25.4} />
        </div> 
      */}
    </section>
  );
};

export const OverviewBadges = ({
  active,
  handleBadgeClick,
}: {
  active: Badges;
  handleBadgeClick: (text: Badges) => void;
}) => {
  return (
    <section className="top-[72px] z-10 flex flex-row gap-3 bg-custom-gray-200 pb-3  pt-5 dark:bg-custom-dark-900 lg:sticky lg:top-24">
      {BADGES.map((badge) => (
        <OverviewBadge
          key={badge}
          text={badge}
          onClick={() => handleBadgeClick(badge)}
          active={badge === active}
        />
      ))}
    </section>
  );
};
