export type Chain =
  | "BSC" // name suffix [b]
  | "ETH" // name suffix [e]
  | "SOL" // name suffix [s]
  | "ARB" // name suffix [a]
  | "BTC" // name suffix [t]
  | "FTM" // name suffix [f]
  | "AVAX" // name suffix [x]
  | "MATIC"; // name suffix [m]

export type Bridge = "wormhole" | "celer";

export interface Socials {
  x?: string;
  telegram?: string;
  discord?: string;
  website?: string;
  github?: string;
  docs?: string;
}

export type TokenKind =
  | "DeFi"
  | "Meme"
  | "Layer1"
  | "Layer2"
  | "NFT"
  | "SocialFi"
  | "GameFi"
  | "StableCoin"
  | "LST";

export interface Token {
  name?: string;
  chain?: Chain;
  symbol: string;
  bridge?: Bridge;
  decimals: number;
  type: `0x${string}`;
  logoUrl?: string;
  socials?: Socials;
  kind?: TokenKind;
  coinMetadata?: string;
}
