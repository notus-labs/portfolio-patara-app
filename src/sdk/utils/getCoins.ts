import { CoinStruct, SuiClient } from "@mysten/sui/client";
import { invariant } from "ts-invariant";

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
  };
}

type GetMultiCoinDecimalsArgs = {
  coins: string[];
  address: string;
  provider: SuiClient;
  decimals: number;
};

export async function getMultiCoinsAndNormalizeWithDecimals(
  params: GetMultiCoinDecimalsArgs,
) {
  const { coins, address, provider, decimals } = params;
  let balances = await provider.getAllBalances({ owner: address });
  balances = balances.filter((balance) => coins.includes(balance.coinType));

  return balances.map((balance) => {
    // normalize and format
    const balanceValue = BigInt(balance.totalBalance);
    const formattedBalance = (Number(balanceValue) / 10 ** decimals).toFixed(
      decimals,
    );

    return {
      raw: balanceValue,
      formatted: formattedBalance,
      type: balance.coinType,
    };
  });
}
