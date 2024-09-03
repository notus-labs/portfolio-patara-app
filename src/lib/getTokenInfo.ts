import { CoinMetadata } from "@mysten/sui/client";
import { TokenInfo } from "@sonarwatch/portfolio-core";
import SuiTokenList from "@sonarwatch/token-lists/build/sonarwatch.sui.tokenlist.json";

const DEFAULT_TOKEN_INFO: TokenInfo = {
  name: "Unknown",
  symbol: "UNK",
  decimals: 18,
  networkId: "sui",
  address: "0x0",
  extensions: {},
  logoURI: "",
  tags: [],
};

const SUITABLE_TOKEN: CoinMetadata = {
  name: "SUITABLE",
  symbol: "TABLE",
  decimals: 9,
  description: "Suitable",
  iconUrl:
    "https://tablesui.xyz/wp-content/uploads/2024/02/tablelogo200x200.png",
};

export function getTokenInfo(
  tokenInfo: Record<string, TokenInfo>,
  address: string,
): TokenInfo {
  const token = tokenInfo[address];
  if (token) return token;

  address = address?.replaceAll("-", "::");

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
    ...DEFAULT_TOKEN_INFO,
    address,
  };
}

export function getTokenInfoFromMetadata(
  tokenInfo: Record<string, CoinMetadata>,
  address: string,
): CoinMetadata {
  if (
    address ===
    "0x93c5b75322b5f9fc194e16d869b30a1db8d1f1826b2371c776c21c3d6a375b10::suitable::SUITABLE"
  ) {
    return SUITABLE_TOKEN;
  }

  const suiToken = SuiTokenList.tokens.find(
    (token) => token.address === address,
  );
  const tokenFromTokenInfo = tokenInfo[address];

  const result = {
    name: parseSafe(
      tokenFromTokenInfo?.name,
      suiToken?.name,
      DEFAULT_TOKEN_INFO.name,
    ),
    symbol: parseSafe(
      tokenFromTokenInfo?.symbol,
      suiToken?.symbol,
      DEFAULT_TOKEN_INFO.symbol,
    ),
    decimals: parseSafeNumber(
      tokenFromTokenInfo?.decimals,
      suiToken?.decimals,
      DEFAULT_TOKEN_INFO.decimals,
    ),
    description: parseSafe(
      tokenFromTokenInfo?.description,
      "",
      DEFAULT_TOKEN_INFO.name,
    ),
    iconUrl: parseSafe(
      tokenFromTokenInfo?.iconUrl,
      suiToken?.logoURI,
      DEFAULT_TOKEN_INFO.logoURI,
    ),
  };

  if (result.iconUrl?.includes("USDC")) {
    result.iconUrl = result.iconUrl.replace("png", "webp");
  }

  return result;
}

function parseSafe<T>(
  primaryValue: T | undefined | null,
  secondaryValue: T | undefined,
  defaultValue: T,
): T {
  if (
    primaryValue &&
    typeof primaryValue === "string" &&
    primaryValue.length > 0
  )
    return primaryValue;
  if (
    secondaryValue &&
    typeof secondaryValue === "string" &&
    secondaryValue.length > 0
  )
    return secondaryValue;
  return defaultValue;
}

function parseSafeNumber(
  primaryValue: number | undefined,
  secondaryValue: number | undefined,
  defaultValue: number,
): number {
  return primaryValue ?? secondaryValue ?? defaultValue;
}
