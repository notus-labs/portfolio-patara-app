import { Token } from "./types";

export const STRICT_LIST: ReadonlyArray<Token> = [
  {
    name: "Sui",
    decimals: 9,
    symbol: "SUI",
    type: "0x2::sui::SUI",
    logoUrl: "https://strapi-dev.scand.app/uploads/sui_c07df05f00.png",
    kind: "Layer1",
  },
  {
    decimals: 6,
    chain: "ETH",
    name: "wUSDCe",
    symbol: "USDC",
    bridge: "wormhole",
    type: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
    logoUrl: "https://strapi-dev.scand.app/uploads/usdc_8cc5687a10.png",
    kind: "StableCoin",
  },
];
