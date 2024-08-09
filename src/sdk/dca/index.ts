import { EventId, SuiClient } from "@mysten/sui/client";
import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui/utils";
import invariant from "ts-invariant";

import { NORMALIZED_SUI_COINTYPE } from "@/lib/coinType";

import { getCoins } from "../utils/getCoins";
import { mergeCoins } from "../utils/mergeCoins";

import { ACCOUNT_CAP, MODULE, REGISTRY, TRADE_POLICY } from "./addresses";
import { DEEP_BOOK_CLIENT } from "./client";

export async function newDCA(
  provider: SuiClient,
  address: string,
  coin_in: bigint,
  every: number,
  number_of_orders: number,
  time_scale: number,
  min: bigint,
  max: bigint,
  coin_in_type: string,
  coin_out_type: string,
): Promise<Transaction> {
  const transaction = new Transaction();
  let coin_in_object: TransactionArgument;

  if (coin_in_type === NORMALIZED_SUI_COINTYPE) {
    coin_in_object = transaction.splitCoins(transaction.gas, [coin_in]);
  } else {
    const coins = await getCoins({
      address,
      coin: coin_in_type,
      provider,
    });

    coin_in_object = transaction.splitCoins(
      mergeCoins({
        tx: transaction,
        coins: coins,
      }),
      [coin_in],
    );
  }

  const dca = transaction.moveCall({
    target: `${MODULE}::dca::new`,
    arguments: [
      transaction.object(SUI_CLOCK_OBJECT_ID),
      transaction.object(REGISTRY),
      coin_in_object,
      transaction.pure.u64(every),
      transaction.pure.u64(number_of_orders),
      transaction.pure.u8(time_scale),
      transaction.pure.u64(min),
      transaction.pure.u64(max),
      transaction.pure.u64(100_000),
      transaction.pure.address("0x0"),
    ],
    typeArguments: [coin_in_type, coin_out_type],
  });

  shareDCA(transaction, dca, coin_in_type, coin_out_type);

  return transaction;
}

export async function swap(
  dca: string,
  coin_in_type: string,
  coin_out_type: string,
): Promise<Transaction> {
  const transaction = new Transaction();

  const [request, coinIn] = requestFromTradePolicy(
    transaction,
    transaction.object(dca),
    coin_in_type,
    coin_out_type,
  );

  const r1 = await getPool(coin_in_type, coin_out_type);
  invariant(r1, "No pool found for the given coins");

  const { pool, swap_way } = r1;

  if (swap_way === "base") {
    swapBaseDeepBook(
      transaction,
      request,
      coinIn,
      transaction.object(pool),
      transaction.object(ACCOUNT_CAP),
      coin_in_type,
      coin_out_type,
    );
  } else {
    swapQuoteDeepBook(
      transaction,
      request,
      coinIn,
      transaction.object(pool),
      transaction.object(ACCOUNT_CAP),
      coin_in_type,
      coin_out_type,
    );
  }

  confirmRequest(
    transaction,
    request,
    transaction.object(TRADE_POLICY),
    coin_in_type,
    coin_out_type,
  );

  return transaction;
}

export async function swapQuote(
  dca: string,
  coin_in_type: string,
  coin_out_type: string,
): Promise<Transaction> {
  const transaction = new Transaction();

  const [request, coinIn] = requestFromTradePolicy(
    transaction,
    transaction.object(dca),
    coin_in_type,
    coin_out_type,
  );

  const r1 = await getPool(coin_in_type, coin_out_type);
  invariant(r1, "No pool found for the given coins");

  const { pool, swap_way } = r1;

  if (swap_way === "base") {
    swapBaseDeepBook(
      transaction,
      request,
      coinIn,
      transaction.object(pool),
      transaction.object(ACCOUNT_CAP),
      coin_in_type,
      coin_out_type,
    );
  } else {
    swapQuoteDeepBook(
      transaction,
      request,
      coinIn,
      transaction.object(pool),
      transaction.object(ACCOUNT_CAP),
      coin_in_type,
      coin_out_type,
    );
  }

  confirmRequest(
    transaction,
    request,
    transaction.object(TRADE_POLICY),
    coin_in_type,
    coin_out_type,
  );

  return transaction;
}

export function stop(
  dca: string,
  coin_in_type: string,
  coin_out_type: string,
  transaction: Transaction = new Transaction(),
): Transaction {
  transaction.moveCall({
    target: `${MODULE}::dca::stop`,
    arguments: [transaction.object(dca)],
    typeArguments: [coin_in_type, coin_out_type],
  });

  return transaction;
}

export function destroy(
  dca: string,
  coin_in_type: string,
  coin_out_type: string,
  transaction: Transaction = new Transaction(),
): Transaction {
  transaction.moveCall({
    target: `${MODULE}::dca::destroy`,
    arguments: [transaction.object(dca)],
    typeArguments: [coin_in_type, coin_out_type],
  });

  return transaction;
}

export function stopAndDestroy(
  dca: string,
  coin_in_type: string,
  coin_out_type: string,
): Transaction {
  const transaction = new Transaction();

  stop(dca, coin_in_type, coin_out_type, transaction);
  destroy(dca, coin_in_type, coin_out_type, transaction);

  return transaction;
}

function swapBaseDeepBook(
  tx: Transaction,
  request: TransactionArgument,
  coin_in: TransactionArgument,
  pool: TransactionArgument,
  account_cap: TransactionArgument,
  coin_in_type: string,
  coin_out_type: string,
) {
  tx.moveCall({
    target: `${MODULE}::deepbook_adapter::swap_base`,
    typeArguments: [coin_in_type, coin_out_type],
    arguments: [
      request,
      pool,
      tx.object(SUI_CLOCK_OBJECT_ID),
      account_cap,
      tx.pure.u64(0),
      coin_in,
    ],
  });
}

function swapQuoteDeepBook(
  tx: Transaction,
  request: TransactionArgument,
  coin_in: TransactionArgument,
  pool: TransactionArgument,
  account_cap: TransactionArgument,
  coin_in_type: string,
  coin_out_type: string,
) {
  tx.moveCall({
    target: `${MODULE}::deepbook_adapter::swap_quote`,
    typeArguments: [coin_in_type, coin_out_type],
    arguments: [
      request,
      pool,
      tx.object(SUI_CLOCK_OBJECT_ID),
      account_cap,
      tx.pure.u64(0),
      coin_in,
    ],
  });
}

function confirmRequest(
  tx: Transaction,
  request: TransactionArgument,
  dca: TransactionArgument,
  coin_in_type: string,
  coin_out_type: string,
) {
  tx.moveCall({
    target: `${MODULE}::trade_policy::confirm`,
    typeArguments: [coin_in_type, coin_out_type],
    arguments: [tx.object(dca), tx.object(SUI_CLOCK_OBJECT_ID), request],
  });
}

function requestFromTradePolicy(
  tx: Transaction,
  dca: TransactionArgument,
  coin_in_type: string,
  coin_out_type: string,
) {
  const [request, coinIn] = tx.moveCall({
    target: `${MODULE}::trade_policy::request`,
    arguments: [tx.object(TRADE_POLICY), tx.object(dca)],
    typeArguments: [coin_in_type, coin_out_type],
  });

  return [request, coinIn];
}

function shareDCA(
  tx: Transaction,
  dca: TransactionArgument,
  coin_in_type: string,
  coin_out_type: string,
) {
  tx.moveCall({
    target: `${MODULE}::dca::share`,
    arguments: [dca],
    typeArguments: [coin_in_type, coin_out_type],
  });
}

async function getPool(
  coin_in_type: string,
  coin_out_type: string,
): Promise<
  | {
      pool: string;
      swap_way: "base" | "quote";
    }
  | undefined
> {
  let hasNextPage = true;
  let nextCursor: EventId | null | undefined = null;
  const pools = [];

  while (hasNextPage) {
    const response = await DEEP_BOOK_CLIENT.getAllPools({
      cursor: nextCursor,
    });

    const _pools = response.data;
    pools.push(..._pools);
    hasNextPage = response.hasNextPage;

    if (hasNextPage) {
      nextCursor = response.nextCursor;
    }
  }

  // Find the pool that has the coin_in_type and coin_out_type as base and quote or vice versa

  for (const pool of pools) {
    if (
      (pool.baseAsset === coin_in_type && pool.quoteAsset === coin_out_type) ||
      (pool.baseAsset === coin_out_type && pool.quoteAsset === coin_in_type)
    ) {
      return {
        pool: pool.poolId,
        swap_way: pool.baseAsset === coin_in_type ? "base" : "quote",
      };
    }
  }
}
