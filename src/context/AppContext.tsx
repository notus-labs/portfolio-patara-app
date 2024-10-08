import { PropsWithChildren, createContext, useContext, useState } from "react";

import {
  CoinBalance,
  CoinMetadata,
  SuiClient,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { normalizeStructTag } from "@mysten/sui/utils";
import { useSuiClient } from "@suiet/wallet-kit";
import { useQuery } from "@tanstack/react-query";

import { DCATokenSelectionCoins } from "@/components/token/TokenSelectionDialog";
import {
  ParsedCoinBalance,
  getAllCoins,
  parseCoinBalances,
} from "@/lib/coinBalance";
import { getCoinMetadataMap } from "@/lib/coinMetadata";

import { useWalletContext } from "./WalletContext";

type AppContextType = {
  isSidebarOpen: boolean;
  refetchCoinBalances: () => void;
  toggleSidebarOff: () => void;
  toggleSidebarOn: () => void;
  isAccountDrawerOpen: boolean;
  toggleAccountDrawerOff: () => void;
  toggleAccountDrawerOn: () => void;
  client: SuiClient;
  coinBalancesMap: Record<string, ParsedCoinBalance>;
  coinMetadataMap: Record<string, CoinMetadata>;
  coinBalancesRaw: CoinBalance[];
  signExecuteAndWaitTransactionBlock: (
    txb: Transaction,
  ) => Promise<SuiTransactionBlockResponse>;
};

const AppContext = createContext<AppContextType>({
  isSidebarOpen: false,
  refetchCoinBalances: () => {},
  toggleSidebarOff: () => {},
  toggleSidebarOn: () => {},
  isAccountDrawerOpen: false,
  toggleAccountDrawerOff: () => {},
  toggleAccountDrawerOn: () => {},
  client: {} as SuiClient,
  coinBalancesMap: {},
  coinMetadataMap: {},
  coinBalancesRaw: [],
  signExecuteAndWaitTransactionBlock: async () =>
    ({}) as SuiTransactionBlockResponse,
});

export const useAppContext = () => useContext(AppContext);

export function AppContextProvider({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);

  const toggleSidebarOff = () => setIsSidebarOpen(false);
  const toggleSidebarOn = () => setIsSidebarOpen(true);

  const toggleAccountDrawerOff = () => setIsAccountDrawerOpen(false);
  const toggleAccountDrawerOn = () => setIsAccountDrawerOpen(true);

  const client = useSuiClient();
  const { address, signExecuteAndWaitTransactionBlock } = useWalletContext();

  const { data, refetch } = useQuery({
    queryKey: ["suiCoinBalances", address],
    queryFn: () => fetchCoinBalances(client, address),
    refetchInterval: 5000,
  });

  const value = {
    isSidebarOpen,
    toggleSidebarOff,
    toggleSidebarOn,
    refetchCoinBalances: refetch,
    isAccountDrawerOpen,
    toggleAccountDrawerOff,
    toggleAccountDrawerOn,
    client,
    coinBalancesMap: data?.coinBalancesMap ?? {},
    coinMetadataMap: data?.coinMetadataMap ?? {},
    coinBalancesRaw: data?.coinBalancesRaw ?? [],
    signExecuteAndWaitTransactionBlock: (txb: Transaction) =>
      signExecuteAndWaitTransactionBlock(client, txb),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

async function fetchCoinBalances(
  client: SuiClient,
  address?: string,
): Promise<{
  uniqueCoinTypes: string[];
  coinBalancesMap: Record<string, ParsedCoinBalance>;
  coinMetadataMap: Record<string, CoinMetadata>;
  coinBalancesRaw: CoinBalance[];
}> {
  if (!address)
    return {
      uniqueCoinTypes: [],
      coinBalancesMap: {},
      coinMetadataMap: {},
      coinBalancesRaw: [],
    };

  const coinBalancesRaw = (
    await client.getAllBalances({
      owner: address,
    })
  ).map((cb) => ({ ...cb, coinType: normalizeStructTag(cb.coinType) }));

  const coinStructs = await getAllCoins(client, address);
  const uniqueCoinTypes = new Set(
    coinStructs.map((coin) => normalizeStructTag(coin.coinType)),
  );

  for (const coin of DCATokenSelectionCoins) {
    uniqueCoinTypes.add(normalizeStructTag(coin));
  }

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
    uniqueCoinTypes: Array.from(uniqueCoinTypes),
    coinBalancesMap,
    coinMetadataMap: metadataMap,
    coinBalancesRaw,
  };
}
