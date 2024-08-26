import BigNumber from "bignumber.js";
import _Decimal from "decimal.js-light";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import toFormat from "toformat";

export type BigNumberish = BigNumber | bigint | string | number;
const ONE_COIN = new BigNumber(1000000000);
export const MAX_NUMBER_INPUT_VALUE = 9000000000000000;

/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

const parse = (_value: BigNumberish) => {
  const value = isBigNumberish(_value) ? _value.toString() : 0;
  return new BigNumber(value);
};

export class FixedPointMath {
  private _value = ZERO_BIG_NUMBER;

  protected constructor(_value: BigNumberish) {
    this._value = parse(_value);
  }

  private parseValue(x: BigNumberish | FixedPointMath): BigNumber {
    if (x instanceof FixedPointMath) return x.value();

    return parse(x);
  }

  private isZero(value: BigNumberish | FixedPointMath): boolean {
    if (value instanceof BigNumber) return value.isZero();
    if (value === 0) return true;
    if (value instanceof FixedPointMath) return value.value().isZero();
    return value === "0";
  }

  public static from(value: BigNumberish): FixedPointMath {
    return new FixedPointMath(value);
  }

  public static toBigNumber(
    value: number | string,
    decimals = 9,
    significant = 6,
  ): BigNumber {
    if (value == null || isNaN(+value)) return ZERO_BIG_NUMBER;

    const factor = 10 ** significant;

    if (typeof value === "number" && 0 > value * factor) return ZERO_BIG_NUMBER;
    if (
      typeof value === "string" &&
      0 > +parseToPositiveStringNumber(value) * factor
    )
      return ZERO_BIG_NUMBER;

    const x = Math.floor(+value * factor);

    return parseBigNumberish(
      x >= MAX_NUMBER_INPUT_VALUE ? MAX_NUMBER_INPUT_VALUE : x,
    ).multipliedBy(new BigNumber(10).pow(decimals - significant));
  }

  public static toNumber(
    value: BigNumber,
    decimals = 9,
    significantRounding = 4,
    significant = 6,
  ): number {
    if (value?.isZero()) return 0;

    const result = +Fraction.from(
      value,
      new BigNumber(10).pow(decimals),
    ).toSignificant(significant, { groupSeparator: "" }, significantRounding);

    return !decimals ? Math.floor(result) : result;
  }

  public toNumber(decimals = 9, rounding = 4, significant = 6): number {
    return FixedPointMath.toNumber(
      this._value,
      decimals,
      rounding,
      significant,
    );
  }

  public div(x: BigNumberish | FixedPointMath): FixedPointMath {
    if (this.isZero(x)) return FixedPointMath.from(0);
    return new FixedPointMath(
      this._value.multipliedBy(ONE_COIN).div(this.parseValue(x)),
    );
  }

  public mul(x: BigNumberish | FixedPointMath): FixedPointMath {
    return new FixedPointMath(
      this._value
        .multipliedBy(this.parseValue(this.parseValue(x)))
        .div(ONE_COIN),
    );
  }

  public add(x: BigNumberish | FixedPointMath): FixedPointMath {
    return new FixedPointMath(this._value.plus(this.parseValue(x)));
  }

  public sub(x: BigNumberish | FixedPointMath): FixedPointMath {
    return new FixedPointMath(this._value.minus(this.parseValue(x)));
  }

  public pow(x: BigNumberish | FixedPointMath): FixedPointMath {
    return new FixedPointMath(this._value.pow(this.parseValue(x)));
  }

  public toPercentage(toSignificant = 2): string {
    const fraction = Fraction.from(this._value, ONE_COIN.multipliedBy(100));

    return `${fraction.toSignificant(toSignificant || 1)} %`;
  }

  public gt(x: BigNumberish | FixedPointMath): boolean {
    return this._value.gt(this.parseValue(x));
  }

  public gte(x: BigNumberish | FixedPointMath): boolean {
    return this._value.gte(this.parseValue(x));
  }
  public lt(x: BigNumberish | FixedPointMath): boolean {
    return this._value.lt(this.parseValue(x));
  }
  public lte(x: BigNumberish | FixedPointMath): boolean {
    return this._value.lte(this.parseValue(x));
  }

  public eq(x: BigNumberish | FixedPointMath): boolean {
    return this._value.eq(this.parseValue(x));
  }

  public value(): BigNumber {
    return this._value;
  }
}

const Decimal = toFormat(_Decimal);

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: Decimal.ROUND_UP,
};

export class Fraction {
  public readonly numerator: BigNumber;
  public readonly denominator: BigNumber;

  public constructor(
    numerator: BigNumber.Value,
    denominator: BigNumber.Value = 1,
  ) {
    this.numerator = parseBigNumberish(numerator);
    this.denominator = parseBigNumberish(denominator);
  }

  public get quotient(): BigNumber {
    return this.numerator.div(this.denominator);
  }

  public get remainder(): Fraction {
    return new Fraction(this.numerator.mod(this.denominator), this.denominator);
  }

  public invert(): Fraction {
    return new Fraction(this.numerator, this.denominator);
  }

  public static from(
    numerator: BigNumber.Value,
    denominator: BigNumber.Value = 1,
  ): Fraction {
    return new Fraction(numerator, denominator);
  }

  private static tryParseFraction(
    fractionish: BigNumber.Value | Fraction,
  ): Fraction {
    if (
      fractionish instanceof BigNumber ||
      typeof fractionish === "number" ||
      typeof fractionish === "string"
    )
      return new Fraction(fractionish);

    throw new Error("Could not parse fraction");
  }

  public plus(other: Fraction | BigNumber.Value): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    if (otherParsed.denominator.eq(this.denominator))
      return new Fraction(
        this.numerator.plus(otherParsed.numerator),
        otherParsed.denominator,
      );

    return new Fraction(
      this.numerator
        .multipliedBy(otherParsed.denominator)
        .plus(this.denominator.multipliedBy(otherParsed.numerator)),
      this.denominator.multipliedBy(otherParsed.denominator),
    );
  }

  public minustract(other: Fraction | BigNumber.Value): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    if (otherParsed.denominator.eq(this.denominator))
      return new Fraction(
        this.numerator.minus(otherParsed.numerator),
        otherParsed.denominator,
      );

    return new Fraction(
      this.numerator
        .multipliedBy(otherParsed.denominator)
        .minus(this.denominator.multipliedBy(otherParsed.numerator)),
      this.denominator.multipliedBy(otherParsed.denominator),
    );
  }

  public lessThan(other: Fraction | BigNumber.Value): boolean {
    const otherParsed = Fraction.tryParseFraction(other);

    return this.numerator
      .multipliedBy(otherParsed.denominator)
      .lt(otherParsed.numerator.multipliedBy(this.denominator));
  }

  public equalTo(other: Fraction | BigNumber.Value): boolean {
    const otherParsed = Fraction.tryParseFraction(other);

    return this.numerator
      .multipliedBy(otherParsed.denominator)
      .eq(otherParsed.numerator.multipliedBy(this.denominator));
  }

  public divide(other: Fraction | BigNumber.Value): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(
      this.numerator.multipliedBy(otherParsed.denominator),
      this.denominator.multipliedBy(otherParsed.numerator),
    );
  }

  public multipliedBytiply(other: Fraction | BigNumber.Value): Fraction {
    const otherParsed = Fraction.tryParseFraction(other);
    return new Fraction(
      this.numerator.multipliedBy(otherParsed.numerator),
      this.denominator.multipliedBy(otherParsed.denominator),
    );
  }

  public toSignificant(
    significantDigits: number,
    format: Record<string, string> = { groupSeparator: "" },
    rounding: Rounding = Rounding.ROUND_HALF_UP,
  ): string {
    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding],
    });

    const quotient = new Decimal(this.numerator.toString())
      .div(this.denominator.toString())
      .toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toFixed(decimalPlaces: number, options?: Record<string, any>): string {
    const value = this.numerator.div(this.denominator).toString();
    const decimals = value.slice(value.length - decimalPlaces);
    const nonDecimals = value.slice(0, value.length - decimalPlaces);
    const num = Number(`${nonDecimals}.${decimals}`);
    return new Intl.NumberFormat("en-IN", options).format(num);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseBigNumberish = (x: any): BigNumber =>
  isBigNumberish(x) ? new BigNumber(x.toString()) : ZERO_BIG_NUMBER;

const parseToPositiveStringNumber = (x: string): string => {
  if (isNaN(+x)) return "0";
  if (0 > +x) return "0";
  return x;
};

const ZERO_BIG_NUMBER = new BigNumber(0);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isBigNumberish(value: any): value is BigNumberish {
  return (
    value != null &&
    (BigNumber.isBigNumber(value) ||
      (typeof value === "number" && value % 1 === 0) ||
      (typeof value === "string" && !!value.match(/^-?[0-9]+$/)) ||
      isHexString(value) ||
      typeof value === "bigint")
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isHexString(value: any, length?: number): boolean {
  if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (length && value.length !== 2 + 2 * length) {
    return false;
  }
  return true;
}
