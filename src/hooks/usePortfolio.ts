import { SuiClient } from "@mysten/sui/client";
import { FetchersResult, TokenInfo } from "@sonarwatch/portfolio-core";
import { useQuery } from "@tanstack/react-query";
import { invariant } from "ts-invariant";

import { useAppContext } from "@/context/AppContext";
import { useWalletContext } from "@/context/WalletContext";
import { getCoinMetadataMap } from "@/lib/coinMetadata";
import { getTokenInfo } from "@/lib/getTokenInfo";

export function usePortfolio() {
  const { address } = useWalletContext();
  const { client } = useAppContext();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["suiPortfolio", address],
    queryFn: () => fetchSuiPortfolio(address, client),
  });

  return {
    data,
    isLoading,
    isError,
  };
}

async function fetchSuiPortfolio(
  address?: string,
  client?: SuiClient,
): Promise<FetchersResult> {
  invariant(address, "Address is required");
  invariant(client, "Client is required");

  let data: FetchersResult = await fetch(
    `https://api.patara.app/portfolio/sui/v1/${address}`,
  ).then((res) => res.json());

  // @ts-expect-error tokenInfo is not defined
  const tokenInfo = data.tokenInfo["sui"] as Record<string, TokenInfo>;
  const tokensToFetch = new Set<string>();

  data.elements.forEach((element) => {
    if (element.type === "multiple" && element.data.assets.length > 0) {
      element.data.assets.forEach((asset) => {
        if (asset.type === "token") {
          if (getTokenInfo(tokenInfo, asset.data.address).name !== "Unknown")
            return;

          const address = asset.data.address?.replaceAll("-", "::");
          tokensToFetch.add(address);
        }
      });
    }
  });

  const coinAddresses = Array.from(tokensToFetch);

  if (coinAddresses) {
    const coinMetadataMap = await getCoinMetadataMap(client, coinAddresses);
    const newTokenInfo = { ...tokenInfo };

    Object.entries(coinMetadataMap).forEach(([address, metadata]) => {
      newTokenInfo[address?.replaceAll("::", "-")] = {
        address: address?.replaceAll("::", "-"),
        name: metadata.name,
        symbol: metadata.symbol,
        decimals: metadata.decimals,
        logoURI: metadata.iconUrl || "",
        networkId: "sui",
      };
    });

    data = {
      ...data,
      tokenInfo: {
        sui: newTokenInfo,
      },
    };
  }

  return data;
}
