import { useQuery } from "@tanstack/react-query";

import { useWalletContext } from "@/context/WalletContext";

import { fetchDCAObjects } from "./fetch";

export function useDCA() {
  const { address } = useWalletContext();

  return useQuery({
    queryKey: ["dca", address],
    queryFn: () => fetchDCAObjects(address!),
    enabled: !!address,
    refetchInterval: 10000,
  });
}
