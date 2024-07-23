import { normalizeStructTag } from "@mysten/sui/utils";

const SUI_COINTYPE = "0x2::sui::SUI";
export const NORMALIZED_SUI_COINTYPE = normalizeStructTag(SUI_COINTYPE);
export const NORMALIZED_USDT_COINTYPE =
  "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN";

export const extractSymbolFromCoinType = (coinType: string) =>
  coinType.split("::").at(-1);

export const isSui = (coinType: string) =>
  normalizeStructTag(coinType) === NORMALIZED_SUI_COINTYPE;
