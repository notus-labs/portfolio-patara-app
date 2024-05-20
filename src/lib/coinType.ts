import { normalizeStructTag } from "@mysten/sui.js/utils";

const SUI_COINTYPE = "0x2::sui::SUI";
export const NORMALIZED_SUI_COINTYPE = normalizeStructTag(SUI_COINTYPE);

export const extractSymbolFromCoinType = (coinType: string) =>
  coinType.split("::").at(-1);

export const isSui = (coinType: string) =>
  normalizeStructTag(coinType) === NORMALIZED_SUI_COINTYPE;
