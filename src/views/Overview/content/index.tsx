import { TokenInfo } from "@sonarwatch/portfolio-core";

import { usePortfolio } from "@/hooks/usePortfolio";

import { Badges } from "../Overview.types";

import { OverviewContentBorrowLend } from "./Content.borrow";
import { OverviewContentLP } from "./Content.lp";
import { OverviewContentNFTs } from "./Content.nfts";
import { OverviewContentWallet } from "./Content.wallet";

export const OverviewContent = ({ active }: { active: Badges }) => {
  const { data, isLoading, isError } = usePortfolio();

  if (!data || isError || isLoading) return null;
  if (
    (
      data as unknown as {
        isPorfolioError: boolean;
      }
    ).isPorfolioError
  )
    return null;

  if (active === "Portfolio") {
    const portfolioDataWithoutNFTs = data.elements.filter(
      (element) => element.platformId !== "wallet-nfts",
    );

    if (!portfolioDataWithoutNFTs) return null;

    return (
      <div className="flex flex-col gap-5">
        {portfolioDataWithoutNFTs
          .sort((a, b) => {
            // if platform id is wallet-tokens, it should be first
            // then look to value
            if (a.platformId === "wallet-tokens") return -1;
            if (b.platformId === "wallet-tokens") return 1;

            if (a.value && b.value) {
              return b.value - a.value;
            }

            return 0;
          })
          .map((element) => {
            if (
              element.type === "multiple" &&
              element.platformId === "wallet-tokens"
            ) {
              return (
                <OverviewContentWallet
                  key={element.platformId}
                  wallet={element}
                  // TODO: Fix this type error
                  // @ts-expect-error tokenInfo is not defined
                  tokenInfo={data.tokenInfo["sui"] as Record<string, TokenInfo>}
                />
              );
            }

            if (element.type === "borrowlend") {
              return (
                <OverviewContentBorrowLend
                  key={element.platformId}
                  borrowlend={element}
                  // TODO: Fix this type error
                  // @ts-expect-error tokenInfo is not defined
                  tokenInfo={data.tokenInfo["sui"] as Record<string, TokenInfo>}
                />
              );
            }

            if (element.type === "liquidity") {
              return (
                <OverviewContentLP
                  key={element.platformId}
                  liquidity={element}
                  // TODO: Fix this type error
                  // @ts-expect-error tokenInfo is not defined
                  tokenInfo={data.tokenInfo["sui"] as Record<string, TokenInfo>}
                />
              );
            }
          })}
      </div>
    );
  }

  if (active === "NFTs") {
    const nfts = data.elements.find(
      (element) =>
        element.type === "multiple" && element.platformId === "wallet-nfts",
    );

    if (!nfts) return null;
    if (nfts.type !== "multiple") return null;

    return <OverviewContentNFTs nfts={nfts} />;
  }
};
