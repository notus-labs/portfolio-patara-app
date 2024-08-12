import { CoinStruct, SuiClient } from "@mysten/sui.js/client";
import {
  TransactionBlock,
  TransactionObjectArgument,
} from "@mysten/sui.js/transactions";
import { useSuiClient } from "@suiet/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import invariant from "ts-invariant";

import { useWalletContext } from "@/context/WalletContext";

export function useBalance(type: string) {
  const { address } = useWalletContext();
  const { client } = useSuiClient();

  const {
    data: balance,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["balance", address, type],
    queryFn: () =>
      getCoinsAndNormalizeWithDecimals({
        coin: type,
        address: address,
        decimals: 9,
        provider: client,
      }),
    enabled: !!address,
  });

  return { balance, isLoading, isError, refetch };
}

type GetCoinArgs = {
  coin: string;
  address: string;
  provider: SuiClient;
};

export async function getCoins(params: GetCoinArgs) {
  const { coin, address, provider } = params;
  let hasNextPage = true;
  let cursor: string | null | undefined = null;
  let coinStructs: CoinStruct[] = [];

  while (hasNextPage) {
    const response = await provider.getCoins({
      owner: address,
      coinType: coin,
      cursor,
    });

    const coins = response.data;
    coinStructs = [...coinStructs, ...coins];
    hasNextPage = response.hasNextPage;

    if (hasNextPage) {
      const { nextCursor } = response;
      cursor = nextCursor;
    }
  }

  return coinStructs;
}

type GetCoinDecimalsArgs = {
  coin: string;
  address?: string;
  provider: SuiClient;
  decimals: number;
};

export async function getCoinsAndNormalizeWithDecimals(
  params: GetCoinDecimalsArgs,
) {
  const { coin, address, provider, decimals } = params;
  invariant(address, "Address is required to get coins");
  const coinStructs = await getCoins({ coin, address, provider });

  // Merge all balances and return the balance of the requested coin, raw and formatted
  const balance = coinStructs.reduce(
    (acc, coin) => acc + BigInt(coin.balance),
    BigInt(0),
  );
  const formattedBalance = (Number(balance) / 10 ** decimals).toFixed(2);

  return {
    raw: balance,
    formatted: formattedBalance,
    coinStructs,
  };
}

type MergeCoinArgs = {
  tx: TransactionBlock;
  coins: CoinStruct[];
};

/**
 * Merges provided coins into a single transaction block.
 * @param {MergeCoinArgs} params - The parameters for merging coins.
 * @param {TransactionBlock} params.tx - The transaction block to merge coins into.
 * @param {CoinStruct[]} params.coins - The coins to merge.
 * @return {TransactionObjectArgument}
 * Returns the merged coin object.
 * @throws {Error} Throws an error if no coins are provided to merge.
 */
export function mergeCoins(params: MergeCoinArgs): TransactionObjectArgument {
  const { tx, coins } = params;
  if (coins.length === 0) throw new Error("No coins provided to merge");
  const [firstCoin, ...otherCoins] = coins;
  const firstCoinInput = tx.object(firstCoin.coinObjectId);

  if (otherCoins.length > 0) {
    tx.mergeCoins(
      firstCoinInput,
      otherCoins.map((coin) => coin.coinObjectId),
    );
  }

  return firstCoinInput;
}
