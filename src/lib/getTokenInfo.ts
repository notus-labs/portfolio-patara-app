import { TokenInfo } from "@sonarwatch/portfolio-core";
import SuiTokenList from "@sonarwatch/token-lists/build/sonarwatch.sui.tokenlist.json";

export function getTokenInfo(
  tokenInfo: Record<string, TokenInfo>,
  address: string,
): TokenInfo {
  const token = tokenInfo[address];
  if (token) return token;

  address = address.replaceAll("-", "::");

  const suiToken = SuiTokenList.tokens.find(
    (token) => token.address === address,
  );

  if (suiToken) {
    return {
      ...suiToken,
      networkId: "sui",
    };
  }

  return {
    address,
    name: "Unknown",
    symbol: "UNK",
    decimals: 18,
    networkId: "sui",
  };
}
