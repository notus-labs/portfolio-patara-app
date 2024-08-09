import BigNumber from "bignumber.js";

export function parseIntoRaw(value: BigNumber | string, decimals: number) {
  return new BigNumber(value).multipliedBy(10 ** decimals);
}
