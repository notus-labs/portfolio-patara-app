export const MAX_NUMBER_INPUT_VALUE = 90000000000;

export const parseInputEventToNumberString = (
  event: React.ChangeEvent<HTMLInputElement>,
  max: number = MAX_NUMBER_INPUT_VALUE,
): string => {
  const value = event.target.value;

  const x =
    isNaN(+value[value.length - 1]) && value[value.length - 1] !== "."
      ? value.slice(0, value.length - 1)
      : value;

  if (isNaN(+x)) return "";

  if (+x < 0) return "0";

  if (+x >= max) return max.toString();

  if (x.charAt(0) == "0" && !x.startsWith("0.")) return String(Number(x));

  if (
    value.includes(".") &&
    value[value.length - 1] !== "." &&
    value[value.length - 1] !== "0"
  )
    return (+parseFloat(x).toFixed(6)).toPrecision();

  return x;
};
