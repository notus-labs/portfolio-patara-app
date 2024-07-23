import React from "react";

import { ArrowDown, CaretDown } from "@phosphor-icons/react";
import { useFormContext, useWatch } from "react-hook-form";

import { TokenSelectionDialog } from "@/components/token/TokenSelectionDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppContext } from "@/context/AppContext";
import { usePrice } from "@/hooks/usePrice";
import { getTokenInfoFromMetadata } from "@/lib/getTokenInfo";
import { parseIntoRaw } from "@/lib/raw";
import { parseInputEventToNumberString } from "@/lib/string";
import { cn } from "@/lib/utils";

import {
  DCASchemaType,
  DcaPercentageBadgeProps,
  InputWithExtraProps,
  SwapInputProps,
} from "./DCA.types";

export const PercentageBadge: React.FC<DcaPercentageBadgeProps> = ({
  text,
}) => {
  const { coinBalancesMap } = useAppContext();
  const { setValue, control } = useFormContext<DCASchemaType>();

  const coinType = useWatch({
    control,
    name: "token_in",
  });

  const balance = coinType ? coinBalancesMap[coinType] : undefined;

  function onClick() {
    if (!balance) return;

    const value =
      text === "100"
        ? balance.balance.toNumber().toFixed(5)
        : (balance.balance.toNumber() * (parseInt(text) / 100)).toFixed(5);

    setValue("sell", value);

    setValue("sell_raw", parseIntoRaw(value, balance.mintDecimals));
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-lg border border-custom-gray-75 p-1 text-center text-xs text-custom-black"
    >
      {text}%
    </button>
  );
};

export const SwapInput: React.FC<SwapInputProps> = ({ type }) => {
  const { register, setValue, control } = useFormContext<DCASchemaType>();

  const coinInType = useWatch({
    control,
    name: `token_in`,
  });

  const coinOutType = useWatch({
    control,
    name: `token_out`,
  });

  const coinOutAmount = useWatch({
    control,
    name: `buy`,
  });

  const coinOutAmountRaw = useWatch({
    control,
    name: `buy_raw`,
  });

  const coinType = type === "sell" ? coinInType : coinOutType;

  const loading = useWatch({
    control,
    name: `buy_loading`,
  });

  const amount = useWatch({
    control,
    name: type,
  });

  const amountRaw = useWatch({
    control,
    name: `${type}_raw`,
  });

  const { coinMetadataMap } = useAppContext();

  const { data: price } = usePrice(coinType);

  const priceMultipliedAmount = price ? price * parseFloat(amount) : undefined;

  const coinMetadata = coinType
    ? getTokenInfoFromMetadata(coinMetadataMap, coinType)
    : undefined;

  const onTokenSelect = (token: string) => {
    if (type === "sell") {
      setValue("token_in", token);
      if (token === coinOutType) {
        setValue("token_out", coinInType);
        setValue("sell", coinOutAmount);
        setValue("sell_raw", coinOutAmountRaw);
      }
    } else {
      setValue("token_out", token);
      if (token === coinInType) {
        setValue("token_in", coinOutType);
        setValue("sell", coinOutAmount);
        setValue("sell_raw", coinOutAmountRaw);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-custom-gray-75 p-4 py-3">
      <div className="text-right text-sm font-medium text-custom-gray-600">
        {type === "sell" ? "Sell" : "Buy"}
      </div>
      <div className="flex flex-row justify-between">
        <TokenSelectionDialog
          control={control}
          trigger={
            <button className="flex flex-row items-center gap-2 rounded-full border border-custom-gray-100 bg-custom-gray-50 p-2">
              {coinMetadata ? (
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={coinMetadata.iconUrl as string}
                      alt={coinMetadata.name}
                      width={24}
                      height={24}
                    />
                    <AvatarFallback className="bg-dark-gray-500 text-custom-gray-50">
                      {coinMetadata.symbol.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-base font-semibold text-custom-black">
                    {coinMetadata.symbol}
                  </div>
                </div>
              ) : (
                <div className="text-base font-semibold text-custom-black">
                  Select
                </div>
              )}
              <CaretDown className="h-5 w-5 text-custom-black" />
            </button>
          }
          usage={type === "sell" ? "in" : "out"}
          onTokenSelect={onTokenSelect}
        />
        <input
          className={cn(
            "w-1/2 rounded-lg bg-transparent p-2 pr-0 text-right text-2xl text-custom-black placeholder:text-custom-gray-600 focus:outline-none focus:ring-0",
            loading && type === "buy" ? "opacity-50" : null,
          )}
          placeholder="0"
          value={amount}
          disabled={type === "buy"}
          {...register(type, {
            onChange: (v: React.ChangeEvent<HTMLInputElement>) => {
              if (!coinMetadata || type === "buy") {
                setValue(type, amount);
                setValue(`${type}_raw`, amountRaw);
                return;
              }

              const value = parseInputEventToNumberString(v);

              setValue(type, value);
              setValue(
                `${type}_raw`,
                parseIntoRaw(value, coinMetadata.decimals),
              );
            },
          })}
        />
      </div>
      <div className="text-right text-sm text-custom-black">
        {priceMultipliedAmount && !isNaN(priceMultipliedAmount) ? (
          <>${priceMultipliedAmount.toFixed(2)}</>
        ) : (
          <>$0.00</>
        )}
      </div>
    </div>
  );
};

export const SwapInputs: React.FC = () => {
  const { setValue, control } = useFormContext<DCASchemaType>();

  const coinInType = useWatch({
    control,
    name: `token_in`,
  });

  const coinOutType = useWatch({
    control,
    name: `token_out`,
  });

  const coinOutAmount = useWatch({
    control,
    name: `buy`,
  });

  const coinOutAmountRaw = useWatch({
    control,
    name: `buy_raw`,
  });

  return (
    <div className="relative flex h-2 place-content-center items-center justify-center">
      <button
        onClick={() => {
          setValue("token_in", coinOutType);
          setValue("token_out", coinInType);
          setValue("sell", coinOutAmount);
          setValue("sell_raw", coinOutAmountRaw);
        }}
        className="absolute flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-custom-gray-50 bg-custom-gray-100"
      >
        <ArrowDown className="h-6 w-6 text-custom-black" />
      </button>
    </div>
  );
};

export const InputWithExtra: React.FC<InputWithExtraProps> = ({
  text,
  label,
  extra,
}) => {
  const { register, setValue } = useFormContext<DCASchemaType>();

  const value = useWatch({
    name: label,
  });

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-custom-gray-75 p-4 py-3">
      <div className="text-sm font-medium text-custom-gray-600">{text}</div>
      <div className="flex flex-row items-center justify-between">
        <input
          className={cn(
            "rounded-lg bg-transparent p-2 pl-0 text-2xl text-custom-black placeholder:text-custom-gray-600 focus:outline-none focus:ring-0",
            extra ? "w-1/4" : "w-full",
            label === "over" ? "w-3/4" : null,
          )}
          {...register(label, {
            onChange: (v: React.ChangeEvent<HTMLInputElement>) => {
              const value = v.target.value.replace(/[^0-9]/g, "");

              if (label === "every" && value.length > 2) {
                setValue(label, value.slice(0, 2));
                return;
              }

              setValue(label, value);
            },
          })}
          defaultValue={value}
        />
        {extra}
      </div>
    </div>
  );
};
