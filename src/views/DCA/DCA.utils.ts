export function afterDotItsTrailingZeros(value: string) {
  const dotIndex = value.indexOf(".");
  return value
    .slice(dotIndex + 1)
    .split("")
    .every((char) => char === "0");
}
