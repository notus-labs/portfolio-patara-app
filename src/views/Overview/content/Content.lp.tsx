import {
  PortfolioAssetTokenData,
  PortfolioElementLiquidity,
  PortfolioLiquidity,
  TokenInfo,
} from "@sonarwatch/portfolio-core";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPlatform, usePlatforms } from "@/hooks/usePlatforms";
import { getTokenInfo } from "@/lib/getTokenInfo";
import { cn } from "@/lib/utils";

import { OverviewContentBadge } from "../Overview.components";

export const OverviewContentLP = ({
  liquidity,
  tokenInfo,
}: {
  liquidity: PortfolioElementLiquidity;
  tokenInfo: Record<string, TokenInfo>;
}) => {
  const { data } = usePlatforms();
  const platform = getPlatform(liquidity.platformId, data);

  return (
    <div className="flex w-full flex-col gap-5 rounded-xl bg-custom-gray-50 py-3 pb-10">
      <div className="flex flex-row items-center justify-between px-5 py-3">
        <div className="flex flex-row items-center gap-2">
          <div className="rounded-full bg-custom-black p-1">
            <Avatar>
              <AvatarImage src={platform?.image} alt={platform?.name} />
              <AvatarFallback className="border border-black text-custom-black">
                {platform?.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="text-lg font-semibold text-custom-black sm:text-xl">
            {platform?.name}
          </h3>
          <div className="ml-3 hidden flex-row gap-2 sm:flex">
            <OverviewContentBadge
              key={liquidity.networkId}
              text={liquidity.networkId}
            />
            <OverviewContentBadge
              key={liquidity.label}
              text={liquidity.label}
            />
            {liquidity.tags?.map((tag) => (
              <OverviewContentBadge key={tag} text={tag} />
            ))}
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <h3 className="text-lg font-semibold text-custom-black sm:text-xl">
            ${liquidity.value?.toFixed(2)}
          </h3>
        </div>
      </div>
      <OverviewContentLiquidityTable
        assets={liquidity.data.liquidities}
        tokenInfo={tokenInfo}
      />
    </div>
  );
};

const OverviewContentLiquidityTable = ({
  assets,
  tokenInfo,
}: {
  assets: PortfolioLiquidity[];
  tokenInfo: Record<string, TokenInfo>;
}) => {
  return (
    <div className="pt-5">
      <div className="pb-5 pl-5 text-xl font-semibold text-custom-black">
        Supplied
      </div>
      <div className="px-5 sm:px-0">
        <div className="w-full flex-auto overflow-auto">
          <table className="w-full sm:table-fixed">
            <thead className="tr bg-custom-gray-100">
              <tr>
                <th className="text-left">Asset</th>
                <th className="text-left">Balance</th>
                <th className="text-right">Value</th>
              </tr>
            </thead>
            <tbody className="tr">
              {assets.map((asset, index) => {
                const tokens = [
                  ...asset.assets.map((liquidity) =>
                    getTokenInfo(
                      tokenInfo,
                      (liquidity.data as PortfolioAssetTokenData).address,
                    ),
                  ),
                ];

                return (
                  <tr key={index}>
                    <td className="text-left">
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-row rounded-full">
                          {tokens.map((token, index) => (
                            <Avatar
                              key={token.address}
                              className={cn(
                                "h-10 w-10",
                                index > 0 && "-ml-3 border-2 border-white",
                              )}
                            >
                              <AvatarImage
                                src={token?.logoURI}
                                alt={token?.symbol}
                              />
                              <AvatarFallback className="border border-black text-custom-black">
                                {token?.symbol.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="text-sm font-medium text-custom-black">
                          {tokens.map((token, index) => (
                            <span key={token.address}>
                              {token?.symbol}
                              {index < tokens.length - 1 ? "-" : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td
                      className={cn(
                        "text-left",
                        asset.assets.length > 1 ? "flex flex-col gap-1" : null,
                      )}
                    >
                      {asset.assets.map((liquidity) => {
                        const token = getTokenInfo(
                          tokenInfo,
                          (liquidity.data as PortfolioAssetTokenData).address,
                        );

                        return (
                          <span key={token.address}>
                            {liquidity.data.amount.toFixed(2)} {token.symbol}
                          </span>
                        );
                      })}
                    </td>
                    <td className="text-right">{asset.value?.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
