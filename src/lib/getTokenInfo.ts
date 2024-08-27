import { CoinMetadata } from "@mysten/sui/client";
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

export function getTokenInfoFromMetadata(
  tokenInfo: Record<string, CoinMetadata>,
  address: string,
): CoinMetadata {
  const token = {
    name: "Unknown",
    symbol: "UNK",
    decimals: 18,
    description: "",
    iconUrl: "",
  };

  const suiToken = SuiTokenList.tokens.find(
    (token) => token.address === address,
  );

  const tokenFromTokenInfo = tokenInfo[address];

  const returnValue = {
    name: parseSafe(tokenFromTokenInfo?.name, suiToken?.name, token.name),
    symbol: parseSafe(
      tokenFromTokenInfo?.symbol,
      suiToken?.symbol,
      token.symbol,
    ),
    decimals: parseSafeNumber(
      tokenFromTokenInfo?.decimals,
      suiToken?.decimals,
      token.decimals,
    ),
    description: parseSafe(
      tokenFromTokenInfo?.description,
      "",
      token.description,
    ),
    iconUrl: parseSafe(
      tokenFromTokenInfo?.iconUrl,
      suiToken?.logoURI,
      token.iconUrl,
    ),
  };

  if (returnValue.iconUrl.includes("USDC"))
    returnValue.iconUrl.replace("png", "webp");

  return returnValue;
}

function parseSafe(
  tokenFromTokenInfoValue: string | undefined | null,
  suiTokenValue: string | undefined,
  defaultValue: string,
) {
  // if it has length of 0, its basically undefined, so dont use it
  if (tokenFromTokenInfoValue && tokenFromTokenInfoValue.length > 0)
    return tokenFromTokenInfoValue;
  if (suiTokenValue && suiTokenValue.length > 0) return suiTokenValue;
  return defaultValue;
}

function parseSafeNumber(
  tokenFromTokenInfoValue: number | undefined,
  suiTokenValue: number | undefined,
  defaultValue: number,
) {
  if (tokenFromTokenInfoValue) return tokenFromTokenInfoValue;
  if (suiTokenValue) return suiTokenValue;
  return defaultValue;
}
