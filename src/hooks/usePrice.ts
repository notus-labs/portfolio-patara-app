import { useQuery } from "@tanstack/react-query";

import { getPrice } from "@/lib/coinPrice";

export function usePrice(type: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["price", type],
    queryFn: () => getPrice(type),
  });

  return {
    data,
    isLoading,
    isError,
  };
}
