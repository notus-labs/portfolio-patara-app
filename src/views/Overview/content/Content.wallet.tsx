import { Wallet } from "@phosphor-icons/react";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  PortfolioAssetTokenData,
  PortfolioElementMultiple,
  TokenInfo,
} from "@sonarwatch/portfolio-core";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatNumberWith2Decimal, formatUsdWithCents } from "@/lib/format";
import { getTokenInfo } from "@/lib/getTokenInfo";

export const OverviewContentWallet = ({
  wallet,
  tokenInfo,
}: {
  wallet: PortfolioElementMultiple;
  tokenInfo: Record<string, TokenInfo>;
}) => {
  return (
    <div className="flex w-full flex-col gap-5 rounded-xl bg-custom-gray-50 py-3  dark:bg-custom-dark-800">
      <div className="mx-3 flex flex-row items-center justify-between rounded-lg bg-custom-gray-100 px-5  py-3 dark:bg-custom-dark-700">
        <div className="flex flex-row items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-custom-gray-50 dark:bg-custom-dark-800 ">
            <Wallet className="text-custom-black dark:text-white " size={24} />
          </div>
          <h3 className="text-xl font-semibold text-custom-black dark:text-white ">
            Wallet
          </h3>
        </div>
        <h3 className="text-xl font-semibold text-custom-black dark:text-white ">
          {formatUsdWithCents(wallet.value)}
        </h3>
      </div>
      <WalletTokenTable
        tokens={wallet.data.assets
          .filter((asset) => asset.type === "token")
          .map((asset) => asset.data as PortfolioAssetTokenData)}
        tokenInfo={tokenInfo}
      />
    </div>
  );
};

const WalletTokenTable = ({
  tokens,
  tokenInfo,
}: {
  tokens: PortfolioAssetTokenData[];
  tokenInfo: Record<string, TokenInfo>;
}) => {
  return (
    <div className="px-5 sm:px-0">
      <div className="w-full overflow-auto">
        <table className="w-full sm:table-fixed">
          {/* Header should have, Asset, Price, Balance, Value */}
          <thead>
            <tr>
              <th className="text-left">Asset</th>
              <th className="text-left">Price</th>
              <th className="text-left">Balance</th>
              <th className="text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {/* For each token, display the token (logo name), price, balance, and value */}
            {tokens.map((token) => {
              const tokenInfoData = getTokenInfo(tokenInfo, token.address);
              if (!tokenInfoData) return null;

              return (
                <tr key={token.address}>
                  <td className="flex flex-row items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={tokenInfoData.logoURI}
                        alt={tokenInfoData.name}
                      />
                      <AvatarFallback className="border border-black text-custom-black dark:text-white ">
                        {tokenInfoData.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{tokenInfoData.name}</span>
                  </td>
                  <td>{formatUsdWithCents(token.price)}</td>
                  <td>{formatNumberWith2Decimal(token.amount)}</td>
                  <td className="text-right">
                    {formatUsdWithCents(token.amount * (token.price || 0))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
