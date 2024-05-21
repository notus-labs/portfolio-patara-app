import { OverviewBadge, OverviewHeaderBadge } from "./Overview.components";

export const OverviewHeader = () => {
  return (
    <section className="flex w-full flex-col gap-3 rounded-b-2xl bg-custom-gray-50 p-5 pt-3 lg:pt-5">
      <div className="flex flex-col gap-1 text-custom-black">
        <h3 className="text-sm font-medium lg:text-base">Net Worth</h3>
        <h1 className="text-2xl font-semibold lg:text-2.5xl">$1,238.79</h1>
      </div>
      <div className="flex flex-row gap-2">
        <OverviewHeaderBadge text="Wallets" percentage={74.6} />
        <OverviewHeaderBadge text="NFTs" percentage={25.4} />
      </div>
    </section>
  );
};

export const OverviewBadges = () => {
  return (
    <section className="top-[72px] z-10 flex flex-row gap-3 bg-custom-gray-200 pb-3 pt-5 lg:sticky lg:top-24">
      <OverviewBadge text="Portfolio" active />
      <OverviewBadge text="Token" />
      <OverviewBadge text="NFTs" />
    </section>
  );
};
