import { PropsWithChildren, createContext, useContext, useState } from "react";

import {
  CoinBalance,
  CoinMetadata,
  SuiClient,
  getFullnodeUrl,
} from "@mysten/sui.js/client";
import { normalizeStructTag } from "@mysten/sui.js/utils";
import { useSuiProvider } from "@suiet/wallet-kit";
import { useQuery } from "@tanstack/react-query";

import {
  ParsedCoinBalance,
  getAllCoins,
  parseCoinBalances,
} from "@/lib/coinBalance";
import { getCoinMetadataMap } from "@/lib/coinMetadata";

import { useWalletContext } from "./WalletContext";

type AppContextType = {
  isSidebarOpen: boolean;
  toggleSidebarOff: () => void;
  toggleSidebarOn: () => void;
  isAccountDrawerOpen: boolean;
  toggleAccountDrawerOff: () => void;
  toggleAccountDrawerOn: () => void;
  client: SuiClient;
  coinBalancesMap: Record<string, ParsedCoinBalance>;
  coinMetadataMap: Record<string, CoinMetadata>;
  coinBalancesRaw: CoinBalance[];
};

const AppContext = createContext<AppContextType>({
  isSidebarOpen: false,
  toggleSidebarOff: () => {},
  toggleSidebarOn: () => {},
  isAccountDrawerOpen: false,
  toggleAccountDrawerOff: () => {},
  toggleAccountDrawerOn: () => {},
  client: {} as SuiClient,
  coinBalancesMap: {},
  coinMetadataMap: {},
  coinBalancesRaw: [],
});

export const useAppContext = () => useContext(AppContext);

export function AppContextProvider({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);

  const toggleSidebarOff = () => setIsSidebarOpen(false);
  const toggleSidebarOn = () => setIsSidebarOpen(true);

  const toggleAccountDrawerOff = () => setIsAccountDrawerOpen(false);
  const toggleAccountDrawerOn = () => setIsAccountDrawerOpen(true);

  const client = useSuiProvider(getFullnodeUrl("mainnet"));
  const { address } = useWalletContext();

  const { data } = useQuery({
    queryKey: ["suiCoinBalances", address],
    queryFn: () => fetchCoinBalances(client, address),
  });

  const value = {
    isSidebarOpen,
    toggleSidebarOff,
    toggleSidebarOn,
    isAccountDrawerOpen,
    toggleAccountDrawerOff,
    toggleAccountDrawerOn,
    client,
    coinBalancesMap: data?.coinBalancesMap ?? {},
    coinMetadataMap: data?.coinMetadataMap ?? {},
    coinBalancesRaw: data?.coinBalancesRaw ?? [],
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

async function fetchCoinBalances(
  client: SuiClient,
  address?: string,
): Promise<{
  coinBalancesMap: Record<string, ParsedCoinBalance>;
  coinMetadataMap: Record<string, CoinMetadata>;
  coinBalancesRaw: CoinBalance[];
}> {
  if (!address)
    return { coinBalancesMap: {}, coinMetadataMap: {}, coinBalancesRaw: [] };

  const coinBalancesRaw = (
    await client.getAllBalances({
      owner: address,
    })
  ).map((cb) => ({ ...cb, coinType: normalizeStructTag(cb.coinType) }));

  const coinStructs = await getAllCoins(client, address);
  const uniqueCoinTypes = new Set(coinStructs.map((coin) => coin.coinType));
  const metadataMap = await getCoinMetadataMap(
    client,
    Array.from(uniqueCoinTypes),
  );

  const coinBalancesMap = parseCoinBalances(
    coinBalancesRaw,
    Array.from(uniqueCoinTypes),
    metadataMap,
  );

  return {
    coinBalancesMap,
    coinMetadataMap: metadataMap,
    coinBalancesRaw,
  };
}
