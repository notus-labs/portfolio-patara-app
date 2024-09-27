const PREFIX_SUFFIX_LENGTH = 6;
const shorten = (value: string, prefixSuffixLength: number) => {
  return value.length > prefixSuffixLength
    ? `${value.slice(0, prefixSuffixLength)}...${value.slice(
        -prefixSuffixLength,
      )}`
    : value;
};

export const formatAddress = (
  value: string,
  length: number = PREFIX_SUFFIX_LENGTH,
) => shorten(value, length);

export const formatUsdWithCents = (value: number | undefined | null) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currency: "USD",
  }).format(value ?? 0);
};

export const formatNumberWith2Decimal = (value: number | undefined | null) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);
};
