import { SuiClient } from "@mysten/sui/client";
import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import { DcaSDK } from "@patara-app/dca-sdk";

import { NORMALIZED_SUI_COINTYPE } from "@/lib/coinType";

import { getCoins, mergeCoins } from "@/sdk";

import { DELEGATEE, WHITELIST_WITNESS } from "./constants";

export async function newDCA(
  provider: SuiClient,
  address: string,
  coin_in: bigint,
  every: number,
  number_of_orders: number,
  time_scale: number,
  coin_in_type: string,
  coin_out_type: string,
  min?: bigint,
  max?: bigint,
): Promise<Transaction> {
  const sdk = new DcaSDK();
  const transaction = new Transaction();
  let coinIn: TransactionArgument;

  if (coin_in_type === NORMALIZED_SUI_COINTYPE) {
    coinIn = transaction.splitCoins(transaction.gas, [coin_in]);
  } else {
    const coins = await getCoins({
      address,
      coin: coin_in_type,
      provider,
    });

    coinIn = transaction.splitCoins(
      mergeCoins({
        tx: transaction,
        coins: coins,
      }),
      [coin_in],
    );
  }

  sdk.newAndShare({
    coinIn,
    coinInType: coin_in_type,
    coinOutType: coin_out_type,
    delegatee: DELEGATEE,
    every,
    numberOfOrders: number_of_orders,
    timeScale: time_scale,
    witnessType: WHITELIST_WITNESS,
    max,
    min,
    tx: transaction,
  });

  return transaction;
}
