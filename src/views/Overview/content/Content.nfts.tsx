import { PortfolioElementMultiple } from "@sonarwatch/portfolio-core";

import { OverviewNFTCard } from "../Overview.components";

export const OverviewContentNFTs = ({
  nfts,
}: {
  nfts: PortfolioElementMultiple;
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {nfts.data.assets.map((nft) => {
        if (nft.type !== "collectible") return null;
        return <OverviewNFTCard key={nft.data.address} nft={nft.data} />;
      })}
    </div>
  );
};
