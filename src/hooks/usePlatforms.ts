import { Platform } from "@sonarwatch/portfolio-core";
import { useQuery } from "@tanstack/react-query";

export function usePlatforms() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["suiPlatforms"],
    queryFn: () => fetchSuiPlatforms(),
  });

  return {
    data: data || [],
    isLoading,
    isError,
  };
}

async function fetchSuiPlatforms(): Promise<Platform[]> {
  return fetch(`https://api.patara.app/supported_platforms`).then((res) =>
    res.json(),
  );
}

export function getPlatform(
  id: string,
  platforms: Platform[],
): Platform | undefined {
  return platforms.find((platform) => platform.id === id);
}
