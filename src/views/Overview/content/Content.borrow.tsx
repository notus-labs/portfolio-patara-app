import {
  PortfolioAssetToken,
  PortfolioElementBorrowLend,
  TokenInfo,
  Yield,
} from "@sonarwatch/portfolio-core";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPlatform, usePlatforms } from "@/hooks/usePlatforms";
import { getTokenInfo } from "@/lib/getTokenInfo";
import { cn } from "@/lib/utils";

import { OverviewContentBadge } from "../Overview.components";

export const OverviewContentBorrowLend = ({
  borrowlend,
  tokenInfo,
}: {
  borrowlend: PortfolioElementBorrowLend;
  tokenInfo: Record<string, TokenInfo>;
}) => {
  const { data } = usePlatforms();
  const platform = getPlatform(borrowlend.platformId, data);
  const healthRatio = borrowlend.data.healthRatio || null;
  return (
    <div className="flex w-full flex-col gap-5 rounded-xl bg-custom-gray-50 py-3  pb-10 dark:bg-custom-dark-800">
      <div className="flex flex-row items-center justify-between px-5 py-3">
        <div className="flex flex-row items-center gap-2">
          <div className="rounded-full bg-custom-black p-1  dark:bg-white">
            <Avatar>
              <AvatarImage src={platform?.image} alt={platform?.name} />
              <AvatarFallback className="border border-black text-custom-black dark:text-white ">
                {platform?.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h3 className="text-lg font-semibold text-custom-black dark:text-white  sm:text-xl">
            {platform?.name}
          </h3>
          <div className="ml-3 hidden flex-row gap-2 sm:flex">
            <OverviewContentBadge
              key={borrowlend.networkId}
              text={borrowlend.networkId}
            />
            <OverviewContentBadge
              key={borrowlend.label}
              text={borrowlend.label}
            />
            {borrowlend.tags?.map((tag) => (
              <OverviewContentBadge key={tag} text={tag} />
            ))}
          </div>
          {healthRatio && (
            <div className="ml-1 flex flex-row items-center gap-1">
              {/* A status like border, with "H" letter init */}
              <div className="relative size-6">
                <svg
                  className="size-full"
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className={cn(
                      "stroke-current",
                      healthRatio < 0.5
                        ? "text-error-500"
                        : healthRatio < 0.75
                          ? "text-warning-500"
                          : "text-success-500",
                    )}
                    strokeWidth="3"
                  ></circle>
                  <g className="origin-center -rotate-90 transform">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-current text-custom-gray-100 dark:text-custom-dark-500 "
                      strokeWidth="3"
                      strokeDasharray="100"
                      strokeDashoffset={(healthRatio || 1) * 100}
                    ></circle>
                  </g>
                </svg>
                <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                  <span
                    className={cn(
                      "text-center text-sm font-bold",
                      healthRatio < 0.5
                        ? "text-error-500"
                        : healthRatio < 0.75
                          ? "text-warning-500"
                          : "text-success-500",
                    )}
                  >
                    H
                  </span>
                </div>
              </div>
              <div
                className={cn(
                  "text-sm",
                  healthRatio < 0.5
                    ? "text-error-500"
                    : healthRatio < 0.75
                      ? "text-warning-500"
                      : "text-success-500",
                )}
              >
                {((healthRatio || 1) * 100).toFixed(2)}%
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-2">
          <h3 className="text-lg font-semibold text-custom-black dark:text-white  sm:text-xl">
            ${borrowlend.value?.toFixed(2)}
          </h3>
        </div>
      </div>
      {(borrowlend.data.suppliedValue || 0) > 0 && (
        <OverviewContentBorrowLendTable
          type="lend"
          assets={borrowlend.data.suppliedAssets as PortfolioAssetToken[]}
          yields={borrowlend.data.suppliedYields}
          tokenInfo={tokenInfo}
        />
      )}
      {(borrowlend.data.borrowedValue || 0) > 0 && (
        <OverviewContentBorrowLendTable
          type="borrow"
          assets={borrowlend.data.borrowedAssets as PortfolioAssetToken[]}
          yields={borrowlend.data.borrowedYields}
          tokenInfo={tokenInfo}
        />
      )}
      {(borrowlend.data.rewardValue || 0) > 0 && (
        <OverviewContentBorrowLendTable
          type="rewards"
          assets={borrowlend.data.rewardAssets as PortfolioAssetToken[]}
          yields={[]}
          tokenInfo={tokenInfo}
        />
      )}
    </div>
  );
};

const OverviewContentBorrowLendTable = ({
  type,
  assets,
  yields,
  tokenInfo,
}: {
  type: "borrow" | "lend" | "rewards";
  assets: PortfolioAssetToken[];
  yields: Yield[][]; // Array of yields for each asset, only available on borrow and lend
  tokenInfo: Record<string, TokenInfo>;
}) => {
  return (
    <div className="pt-5">
      <div className="pb-5 pl-5 text-xl font-semibold text-custom-black dark:text-white ">
        {type === "borrow"
          ? "Borrowing"
          : type === "lend"
            ? "Lending"
            : "Rewards"}
      </div>
      <div className="px-5 sm:px-0">
        <div className="w-full flex-auto overflow-auto">
          <table className="w-full sm:table-fixed">
            <thead className="tr bg-custom-gray-100 dark:bg-custom-dark-700 ">
              <tr>
                <th className="text-left">
                  <>
                    {
                      {
                        borrow: "Borrowed",
                        lend: "Supplied",
                        rewards: "Rewards",
                      }[type]
                    }
                  </>
                </th>
                <th className="text-left">Price</th>
                <th className="text-left">Balance</th>
                {type === "borrow" || type === "lend" ? (
                  <th className="text-left">APR</th>
                ) : (
                  <th className="text-left"></th>
                )}
                <th className="text-right">Value</th>
              </tr>
            </thead>
            <tbody className="tr">
              {assets.map((asset, index) => {
                const token = getTokenInfo(tokenInfo, asset.data.address);
                const apr =
                  yields && yields[index] && yields[index].length > 0
                    ? type === "borrow" || type === "lend"
                      ? yields[index].length > 0
                        ? yields[index][0].apr || 0
                        : 0
                      : 0
                    : 0;
                return (
                  <tr key={asset.data.address}>
                    <td className="text-left">
                      <div className="flex flex-row items-center gap-2">
                        <div className="rounded-full">
                          <Avatar>
                            <AvatarImage
                              src={token?.logoURI}
                              alt={token?.symbol}
                            />
                            <AvatarFallback className="border border-black text-custom-black dark:text-white ">
                              {token?.symbol.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="text-sm font-medium text-custom-black dark:text-white ">
                          {token?.symbol}
                        </div>
                      </div>
                    </td>
                    <td className="text-left">
                      ${asset.data.price?.toFixed(2)}
                    </td>
                    <td className="text-left">
                      {asset.data.amount.toFixed(2)}
                    </td>
                    {type === "borrow" || type === "lend" ? (
                      <td className="text-left">
                        {apr > 0 ? `${(apr * 100).toFixed(2)}%` : "-"}
                      </td>
                    ) : (
                      <td className="text-left"></td>
                    )}
                    <td className="text-right">
                      $
                      {(asset.data.amount * (asset.data.price || 0)).toFixed(2)}
                    </td>
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
