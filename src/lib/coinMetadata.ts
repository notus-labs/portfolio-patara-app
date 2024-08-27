import { CoinMetadata, SuiClient } from "@mysten/sui/client";
import { normalizeStructTag } from "@mysten/sui/utils";

import { extractSymbolFromCoinType } from "@/lib/coinType";

export const getCoinMetadataMap = async (
  suiClient: SuiClient,
  uniqueCoinTypes: string[],
) => {
  const coinMetadata = await Promise.all(
    uniqueCoinTypes.map((ct) => suiClient.getCoinMetadata({ coinType: ct })),
  );

  const coinMetadataMap: Record<string, CoinMetadata> = {};
  for (let i = 0; i < uniqueCoinTypes.length; i++) {
    const metadata = coinMetadata[i];
    if (!metadata) continue;

    const coinType = normalizeStructTag(uniqueCoinTypes[i]);
    const symbol = metadata?.symbol ?? extractSymbolFromCoinType(coinType);
    const name = metadata?.name ?? symbol;
    const iconUrl = metadata?.iconUrl;

    coinMetadataMap[coinType] = {
      ...metadata,
      symbol,
      name,
      iconUrl,
    };
  }

  return coinMetadataMap;
};
