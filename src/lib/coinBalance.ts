import {
  CoinBalance,
  CoinMetadata,
  CoinStruct,
  SuiClient,
} from "@mysten/sui/client";
import { normalizeStructTag } from "@mysten/sui/utils";
import BigNumber from "bignumber.js";

export async function getAllCoins(
  client: SuiClient,
  owner: string,
): Promise<CoinStruct[]> {
  let cursor = null;
  const allCoins = [];
  while (true) {
    const coins = await client.getAllCoins({ owner, cursor });
    cursor = coins.nextCursor;
    allCoins.push(...coins.data);
    if (!coins.hasNextPage) {
      return allCoins;
    }
  }
}

export type ParsedCoinBalance = {
  coinType: string;
  mintDecimals: number;
  price?: BigNumber;
  symbol: string;
  iconUrl?: string | null;
  balance: BigNumber;
};

export const parseCoinBalances = (
  coinBalances: CoinBalance[],
  uniqueCoinTypes: string[],
  coinMetadataMap?: Record<string, CoinMetadata>,
) => {
  return coinBalances.reduce((acc, coinBalance) => {
    const coinType = normalizeStructTag(coinBalance.coinType);
    const coinMetadata = coinMetadataMap?.[coinType];

    if (uniqueCoinTypes.includes(coinType) && coinMetadata) {
      const mintDecimals = coinMetadata?.decimals as number;

      return {
        ...acc,
        [coinType]: {
          coinType,
          mintDecimals,
          symbol: coinMetadata?.symbol,
          iconUrl: coinMetadata?.iconUrl,
          balance: new BigNumber(coinBalance.totalBalance).div(
            10 ** mintDecimals,
          ),
        },
      };
    } else return acc;
  }, {}) as Record<string, ParsedCoinBalance>;
};
