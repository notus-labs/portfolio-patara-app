import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Aftermath } from "aftermath-ts-sdk";

export const SUI_CLIENT = new SuiClient({
  url: getFullnodeUrl("mainnet"),
});

export const AF_CLIENT = new Aftermath("MAINNET");
