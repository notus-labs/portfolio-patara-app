import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import { DcaSDK, PACKAGES, SHARED_OBJECTS } from "@patara-app/dca-sdk";

import { NORMALIZED_SUI_COINTYPE } from "@/lib/coinType";

import { getCoins, mergeCoins } from "@/sdk";

import { DELEGATEE } from "./constants";

export const DCASDK = new DcaSDK({
  network: "mainnet",
  fullNodeUrl: getFullnodeUrl("mainnet"),
  packages: PACKAGES["mainnet"],
  sharedObjects: SHARED_OBJECTS["mainnet"],
});

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

  DCASDK.newAndShare({
    coinIn,
    coinInType: coin_in_type,
    coinOutType: coin_out_type,
    delegatee: DELEGATEE,
    every,
    numberOfOrders: number_of_orders,
    timeScale: time_scale,
    max,
    min,
    tx: transaction,
    fee: 1_000_000,
    witnessType:
      "0xae944b93ff026d699a9a4e766ffa60be7b22197b8069ca4fa2aac15cfa3ef652::whitelist_adapter::Witness",
  });

  return transaction;
}
