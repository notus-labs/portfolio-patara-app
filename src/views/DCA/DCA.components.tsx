import React, { FC, useState } from "react";

import { normalizeStructTag } from "@mysten/sui/utils";
import {
  ArrowDown,
  ArrowRight,
  ArrowSquareIn,
  CaretDown,
  Pulse,
  X,
} from "@phosphor-icons/react";
import BigNumber from "bignumber.js";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { TokenSelectionDialog } from "@/components/token/TokenSelectionDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/context/AppContext";
import useBreakpoint from "@/hooks/useBreakpoint";
import { usePrice } from "@/hooks/usePrice";
import { NORMALIZED_SUI_COINTYPE } from "@/lib/coinType";
import { getTokenInfoFromMetadata } from "@/lib/getTokenInfo";
import { parseIntoRaw } from "@/lib/raw";
import { parseInputEventToNumberString } from "@/lib/string";
import { cn } from "@/lib/utils";

import { DCAObject, DCASDK, useDCA } from "@/sdk";

import { useChangeUrl, useDCAContext } from "./DCA.hooks";
import {
  DCASchemaType,
  DcaPercentageBadgeProps,
  HistoryBadgeProps,
  HistoryRowProps,
  InputWithExtraProps,
  SwapInputProps,
} from "./DCA.types";

export const DCAForm = () => {
  const { control, setValue } = useFormContext<DCASchemaType>();
  const {
    coinIn,
    coinOut,
    exchangeRate,
    balance,
    insufficientBalance,
    disableTrade,
    onSubmit,
  } = useDCAContext();
  useChangeUrl();
  const loading = useWatch({
    control,
    name: `buy_loading`,
  });

  const timeScale = useWatch({
    control,
    name: `time_scale`,
  });

  const historyOpen = useWatch({
    control,
    name: "history_open",
  });

  const advancedPriceStrategyOpen = useWatch({
    control,
    name: "advancedPriceStrategy",
  });

  return (
    <div
      className={cn(
        "flex h-full w-full max-w-[480px] flex-col rounded-lg bg-custom-gray-50 p-4 dark:bg-custom-dark-800",
        historyOpen ? "max-w-full" : null,
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold">
          {balance && coinIn ? (
            <>
              Balance: {balance.balance.toNumber().toFixed(4)} {coinIn.symbol}
            </>
          ) : (
            <>Dollar Cost Averaging</>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <PercentageBadge text="25" />
          <PercentageBadge text="50" />
          <PercentageBadge text="75" />
          <PercentageBadge text="100" />
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <SwapInput type="sell" />
        <SwapInputs />
        <SwapInput type="buy" />
      </div>
      <div className="mt-2 flex flex-1 flex-grow flex-col gap-2">
        <div className="flex grid-cols-2 flex-col gap-2 md:grid">
          <InputWithExtra
            extra={
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="flex h-full max-h-[38px] flex-row items-center gap-2 rounded-lg border border-custom-gray-100 bg-custom-gray-50 px-3  py-2  font-semibold dark:border-custom-dark-500 dark:bg-custom-dark-800">
                    <span className="text-sm text-custom-black dark:text-white ">
                      {
                        {
                          1: "Minute",
                          2: "Hour",
                          3: "Day",
                          4: "Week",
                        }[timeScale]
                      }
                    </span>
                    <CaretDown className="h-5 w-5 text-custom-black dark:text-white " />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex max-w-32 flex-col gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <>
                      {i !== 0 && (
                        <DropdownMenuItem
                          key={i}
                          className={cn(
                            "flex cursor-pointer items-center justify-center rounded-[4px] bg-custom-gray-75 dark:bg-custom-dark-600 ",
                            "hover:bg-custom-gray-25 hover:text-custom-black dark:hover:bg-custom-dark-400 hover:dark:text-white",
                          )}
                          onClick={() => setValue("time_scale", i)}
                        >
                          {
                            {
                              1: "Minute",
                              2: "Hour",
                              3: "Day",
                              4: "Week",
                            }[i]
                          }
                        </DropdownMenuItem>
                      )}
                    </>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            }
            text="Every"
            label="every"
          />
          <InputWithExtra
            extra={
              <div className="flex h-full max-h-[38px] flex-row items-center gap-1 rounded-lg border border-custom-gray-100 bg-custom-gray-50 px-3  py-2  font-semibold dark:border-custom-dark-500 dark:bg-custom-dark-800">
                <span className="text-sm text-custom-black dark:text-white ">
                  Orders
                </span>
              </div>
            }
            text="Over"
            label="over"
          />
        </div>
        <div className="my-2 flex flex-row justify-between">
          <div className="text-sm font-medium text-custom-dark-900 dark:text-white ">
            Enable Pricing Strategy
          </div>
          <Switch
            onCheckedChange={(checked) =>
              setValue("advancedPriceStrategy", checked)
            }
            checked={advancedPriceStrategyOpen}
          />
        </div>
        <AnimatePresence>
          {advancedPriceStrategyOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <InputWithExtra label="minPrice" text="Min price" />
                <InputWithExtra label="maxPrice" text="Max price" />
              </div>
              {coinIn && coinOut && exchangeRate && (
                <div className="flex flex-row items-center justify-between rounded-lg border border-custom-gray-100 p-2  px-4 dark:border-custom-dark-500">
                  <div className="text-sm font-medium text-custom-gray-600">
                    Current {coinIn.symbol}/{coinOut.symbol} rate
                  </div>
                  <div className="text-right text-xs text-custom-black dark:text-white ">
                    ${exchangeRate.toFixed(5)} {coinIn.symbol}/{coinOut.symbol}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="submit"
          onClick={onSubmit}
          className={cn(
            "mt-auto w-full rounded-lg bg-primary-50 py-5 text-center text-base font-semibold text-primary-500 transition-colors duration-300 hover:bg-primary-100/70",
            "disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:hover:bg-primary-50/50",
            "dark:disabled:bg-custom-dark-600 dark:disabled:text-custom-gray-600",
            "dark:bg-primary-300 dark:text-white",
            "dark:text-white dark:hover:bg-primary-500",
          )}
          disabled={disableTrade}
        >
          {insufficientBalance
            ? "Insufficient balance"
            : loading
              ? "Loading..."
              : "Start DCA"}
        </button>
      </div>
    </div>
  );
};

export const History = () => {
  const { control } = useFormContext<DCASchemaType>();

  const historyOpen = useWatch({
    control,
    name: "history_open",
  });

  return <>{historyOpen ? <HistoryComponent /> : <HistoryButton />}</>;
};

const PercentageBadge: React.FC<DcaPercentageBadgeProps> = ({ text }) => {
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
        ? normalizeStructTag(balance.coinType) === NORMALIZED_SUI_COINTYPE
          ? balance.balance.minus(new BigNumber(0.1).multipliedBy(1))
          : balance.balance
        : balance.balance.multipliedBy(new BigNumber(text).div(100));
    setValue("sell", value.toString());

    setValue(
      "sell_raw",
      value.multipliedBy(10 ** balance.mintDecimals).integerValue(),
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-lg border border-custom-gray-75 p-1  text-center text-xs text-custom-black dark:border-custom-dark-600 dark:text-white "
    >
      {text}%
    </button>
  );
};

const SwapInput: React.FC<SwapInputProps> = ({ type }) => {
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

  const { data: coinInPrice } = usePrice(coinInType);
  const { data: coinOutPrice } = usePrice(coinOutType);

  const exchangeRate =
    coinInPrice && coinOutPrice ? coinInPrice / coinOutPrice : undefined;

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

    if (coinInPrice && exchangeRate) {
      setValue("minPrice", exchangeRate.toFixed(5));
      setValue("maxPrice", (exchangeRate * 1.01).toFixed(5));
    }
  };

  return (
    <div className="flex flex-col gap-1 rounded-lg bg-custom-gray-75 p-4  py-3 dark:bg-custom-dark-600">
      <div className="text-right text-sm font-medium text-custom-gray-600">
        {type === "sell" ? "Sell" : "Buy"}
      </div>
      <div className="flex flex-row justify-between">
        <TokenSelectionDialog
          control={control}
          trigger={
            <button className="flex flex-row items-center gap-2 rounded-full border border-custom-gray-100 bg-custom-gray-50 p-2  dark:border-custom-dark-500  dark:bg-custom-dark-800">
              {coinMetadata ? (
                <div className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={coinMetadata.iconUrl as string}
                      alt={coinMetadata.name}
                      width={24}
                      height={24}
                    />
                    <AvatarFallback className="bg-dark-gray-500 text-custom-gray-50 dark:text-custom-dark-800 ">
                      {coinMetadata.symbol.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-base font-semibold text-custom-black dark:text-white ">
                    {coinMetadata.symbol}
                  </div>
                </div>
              ) : (
                <div className="text-base font-semibold text-custom-black dark:text-white ">
                  Select
                </div>
              )}
              <CaretDown className="h-5 w-5 text-custom-black dark:text-white " />
            </button>
          }
          usage={type === "sell" ? "in" : "out"}
          onTokenSelect={onTokenSelect}
        />
        <input
          className={cn(
            "w-1/2 rounded-lg bg-transparent p-2 pr-0 text-right text-2xl text-custom-black placeholder:text-custom-gray-600  focus:outline-none focus:ring-0 dark:text-white",
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
      <div className="text-right text-sm font-semibold text-custom-black dark:text-white ">
        {priceMultipliedAmount && !isNaN(priceMultipliedAmount) ? (
          <>${priceMultipliedAmount.toFixed(2)}</>
        ) : (
          <>$0.00</>
        )}
      </div>
    </div>
  );
};

const SwapInputs: React.FC = () => {
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
        className="absolute flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-custom-gray-50 bg-custom-gray-100 dark:border-custom-dark-800  dark:bg-custom-dark-500 "
      >
        <ArrowDown className="h-6 w-6 text-custom-black dark:text-white " />
      </button>
    </div>
  );
};

const InputWithExtra: React.FC<InputWithExtraProps> = ({
  text,
  label,
  extra,
}) => {
  const { register, setValue } = useFormContext<DCASchemaType>();

  const value = useWatch({
    name: label,
  });

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-custom-gray-75 p-4  py-3 dark:bg-custom-dark-600">
      <div className="text-sm font-medium text-custom-gray-600">{text}</div>
      <div className="flex flex-row items-center justify-between">
        <input
          className={cn(
            "rounded-lg bg-transparent p-2 pl-0 text-2xl text-custom-black placeholder:text-custom-gray-600  focus:outline-none focus:ring-0 dark:text-white",
            extra ? "w-1/4" : "w-full",
            label === "over" ? "w-3/4" : null,
          )}
          {...register(label, {
            onChange: (v: React.ChangeEvent<HTMLInputElement>) => {
              if (extra) {
                const value = v.target.value.replace(/[^0-9]/g, "");

                if (label === "every" && value.length > 2) {
                  setValue(label, value.slice(0, 2));
                  return;
                }

                setValue(label, value);
              } else {
                const value = parseInputEventToNumberString(v);

                setValue(label, value);
              }
            },
          })}
          defaultValue={value}
        />
        {extra}
      </div>
    </div>
  );
};

const HistoryButton: React.FC = () => {
  const { setValue } = useFormContext<DCASchemaType>();

  const historyOpen = useWatch({
    name: "history_open",
  });

  return (
    <div className="flex h-full items-start justify-start">
      <button
        onClick={() => setValue("history_open", !historyOpen)}
        className={cn(
          "rounded-lg p-1.5 transition-all duration-300",
          "bg-custom-gray-50 text-custom-black",
          "dark:bg-custom-dark-800 dark:text-white",
          "hover:bg-custom-gray-75 hover:text-custom-black",
          "dark:hover:bg-custom-dark-600 dark:hover:text-white",
        )}
      >
        <Pulse className="h-6 w-6" />
      </button>
    </div>
  );
};

const HistoryComponent: React.FC = () => {
  const { control, setValue } = useFormContext<DCASchemaType>();
  const { lg } = useBreakpoint();

  const history_stage = useWatch({
    control,
    name: "history_stage",
  });

  const { data: dcas } = useDCA();

  return (
    <div
      className={cn(
        "flex h-full w-full max-w-full flex-col rounded-lg bg-custom-gray-50 p-2 dark:bg-custom-dark-800 lg:p-4",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <HistoryBadge
            onClick={() => setValue("history_stage", "Active")}
            text="Active DCA"
            active={history_stage === "Active"}
          />
          <HistoryBadge
            onClick={() => setValue("history_stage", "Past")}
            text="Past DCA"
            active={history_stage === "Past"}
          />
        </div>
        {lg && (
          <button
            onClick={() => setValue("history_open", false)}
            className="flex h-10 w-10 items-center justify-center"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      {lg ? (
        <ScrollArea>
          <Accordion type="single" collapsible className="max-w-full">
            <div className="mt-4 flex w-full flex-col gap-2">
              {dcas
                ?.filter((dca) =>
                  history_stage === "Active" ? dca.active : !dca.active,
                )
                .map((dca) => <HistoryRow key={dca.id} dca={dca} />)}
            </div>
          </Accordion>
        </ScrollArea>
      ) : (
        <Accordion type="single" collapsible className="max-w-full">
          <div className="mt-4 flex w-full flex-col gap-2">
            {dcas
              ?.filter((dca) =>
                history_stage === "Active" ? dca.active : !dca.active,
              )
              .map((dca) => <HistoryRow key={dca.id} dca={dca} />)}
          </div>
        </Accordion>
      )}
    </div>
  );
};

const HistoryBadge: FC<HistoryBadgeProps> = ({ text, onClick, active }) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-lg bg-custom-gray-75 px-4 py-2 text-sm font-medium text-custom-gray-600 transition-colors  duration-500 hover:bg-primary-500 hover:text-custom-gray-50 dark:bg-custom-dark-700 dark:text-custom-gray-600 hover:dark:bg-primary-300  hover:dark:text-white lg:text-base",
      active
        ? "bg-primary-500 text-custom-gray-50 dark:bg-primary-300 dark:text-white "
        : null,
    )}
  >
    {text}
  </button>
);

const HistoryRow: FC<HistoryRowProps> = ({ dca }: { dca: DCAObject }) => {
  const { lg } = useBreakpoint();
  const { coinMetadataMap } = useAppContext();
  const sellInfo = getTokenInfoFromMetadata(
    coinMetadataMap,
    `0x${dca.input.name}`,
  );
  const buyInfo = getTokenInfoFromMetadata(
    coinMetadataMap,
    `0x${dca.output.name}`,
  );

  const percentage = 100 - (dca.remainingOrders / dca.orderCount) * 100;

  const sellBalance = BigNumber(
    dca.orders.reduce((acc, order) => {
      return acc.plus(order.input_amount);
    }, new BigNumber(0)),
  )
    .minus(dca.inputBalance)
    .abs()
    .div(10 ** sellInfo.decimals)
    .toFixed(2);

  const spentBalance = BigNumber(
    dca.orders.reduce((acc, order) => {
      return acc.plus(order.input_amount);
    }, new BigNumber(0)),
  )
    .div(10 ** sellInfo.decimals)
    .toFixed(2);

  const eachOrderSize = BigNumber(
    dca.orders.reduce((acc, order) => {
      return acc.plus(order.input_amount);
    }, new BigNumber(0)),
  )
    .div(dca.orderCount)
    .div(10 ** sellInfo.decimals)
    .toFixed(2);

  const buyBalance = BigNumber(
    dca.orders.reduce((acc, order) => {
      return acc.plus(order.output_amount);
    }, new BigNumber(0)),
  )
    .div(10 ** buyInfo.decimals)
    .toFixed(2);

  const minPrice = BigNumber(dca.min)
    .div(10 ** buyInfo.decimals)
    .toFixed(5);

  const maxPrice = BigNumber(dca.max)
    .div(10 ** buyInfo.decimals)
    .toFixed(5);

  const [tab, setTab] = useState<"overview" | "orders">("overview");

  const { signExecuteAndWaitTransactionBlock } = useAppContext();

  return (
    <AccordionItem value={dca.id}>
      <div className="flex w-full flex-col justify-between gap-2 rounded-lg bg-custom-gray-75 p-2 dark:bg-custom-dark-600 lg:p-4">
        <AccordionTrigger className="w-full justify-normal py-0">
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <div className="flex w-[65%] flex-row items-center justify-between gap-2">
              <div className="flex w-[15%] flex-row lg:w-[25%] lg:px-2">
                <Avatar>
                  <AvatarImage
                    src={sellInfo.iconUrl as string}
                    alt={sellInfo.symbol}
                    width={24}
                    height={24}
                  />
                  <AvatarFallback className="bg-dark-gray-500 text-custom-gray-50 dark:text-custom-dark-800 ">
                    {sellInfo.symbol}
                  </AvatarFallback>
                </Avatar>
                <Avatar className="-ml-3 border-2 border-custom-gray-75 dark:border-custom-dark-600">
                  <AvatarImage
                    src={buyInfo.iconUrl as string}
                    alt={buyInfo.symbol}
                    width={24}
                    height={24}
                  />
                  <AvatarFallback className="bg-dark-gray-500 text-custom-gray-50 dark:text-custom-dark-800 ">
                    {buyInfo.symbol}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex w-[60%] flex-row items-center gap-3 lg:px-2">
                <div className="text-base font-semibold">{sellInfo.symbol}</div>
                <ArrowRight className="h-4 w-4" />
                <div className="text-base font-semibold">{buyInfo.symbol}</div>
              </div>
              {lg && (
                <div className="w-[25%] text-nowrap text-base font-medium lg:w-[20%] lg:px-2">
                  {BigNumber(dca.inputBalance)
                    .div(10 ** sellInfo.decimals)
                    .toFixed(2)}{" "}
                  {sellInfo.symbol}
                </div>
              )}
            </div>
            <div className="w-[25%] text-base font-medium lg:w-[10%] lg:px-2">
              {percentage.toFixed(0)}%
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex w-full">
          <div className="mt-2 w-full border-t border-t-custom-gray-300 pt-3 dark:border-t-custom-dark-400">
            <div className="mb-4 flex flex-row gap-4">
              <div
                onClick={() => {
                  setTab("overview");
                }}
                className={cn(
                  "cursor-pointer text-base font-semibold transition-all duration-300",
                  tab === "overview"
                    ? "text-custom-black dark:text-white"
                    : "dark:text-custom-gray-400 text-custom-gray-600",
                )}
              >
                Overview
              </div>
              {dca.orders.length > 0 && (
                <div
                  onClick={() => {
                    setTab("orders");
                  }}
                  className={cn(
                    "cursor-pointer text-base font-semibold transition-all duration-300",
                    tab === "orders"
                      ? "text-custom-black dark:text-white"
                      : "dark:text-custom-gray-400 text-custom-gray-600",
                  )}
                >
                  Orders ({dca.orders.length})
                </div>
              )}
            </div>
            {tab === "overview" ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1 rounded-lg bg-custom-gray-100 p-4 dark:bg-custom-dark-400">
                  <div className="flex flex-row items-center justify-between text-sm text-custom-gray-600">
                    <div>DCA {sellInfo.symbol} Balance</div>
                    <div className="font-semibold text-custom-black dark:text-custom-gray-25">
                      {sellBalance} {sellInfo.symbol}
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between text-sm text-custom-gray-600">
                    <div>Withdrawn {buyInfo.symbol}</div>
                    <div className="font-semibold text-custom-black dark:text-custom-gray-25">
                      {buyBalance} {buyInfo.symbol}
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-1 rounded-lg border border-custom-gray-300 p-4 dark:border-custom-dark-400">
                  <div className="flex flex-row items-center justify-between text-sm text-custom-gray-600">
                    <div>Total Deposited</div>
                    <div className="text-right text-sm font-semibold text-custom-black dark:text-white ">
                      {BigNumber(dca.inputBalance)
                        .div(10 ** sellInfo.decimals)
                        .toFixed(2)}{" "}
                      {sellInfo.symbol}
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between text-sm text-custom-gray-600">
                    <div>Total Spent</div>
                    <div className="text-right text-sm font-semibold text-custom-black dark:text-white ">
                      {spentBalance} {sellInfo.symbol}
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between text-sm text-custom-gray-600">
                    <div>Each Order Size</div>
                    <div className="text-right text-sm font-semibold text-custom-black dark:text-white ">
                      {eachOrderSize} {sellInfo.symbol}
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between text-sm text-custom-gray-600">
                    <div>Minimum Price</div>
                    <div className="text-right text-sm font-semibold text-custom-black dark:text-white ">
                      {dca.min === "0" ? "~" : minPrice}
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between text-sm text-custom-gray-600">
                    <div>Maximum Price</div>
                    <div className="text-right text-sm font-semibold text-custom-black dark:text-white ">
                      {dca.max === "18446744073709551615" ? "~" : maxPrice}
                    </div>
                  </div>
                  <div className="my-2 w-full border-t border-custom-gray-300 dark:border-custom-dark-400"></div>
                  <div className="flex flex-row items-center justify-between text-sm text-custom-gray-600">
                    <div>Buying</div>
                    <div className="text-right text-sm font-semibold text-custom-black dark:text-white ">
                      {buyInfo.symbol}
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between text-sm text-custom-gray-600">
                    <div>Interval</div>
                    <div className="text-right text-sm font-semibold text-custom-black dark:text-white ">
                      Every {dca.every}{" "}
                      {
                        {
                          1: "Minute",
                          2: "Hour",
                          3: "Day",
                          4: "Week",
                        }[dca.timeScale]
                      }
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between text-sm text-custom-gray-600">
                    <div>Orders</div>
                    <div className="text-right text-sm font-semibold text-custom-black dark:text-white ">
                      {dca.orderCount}
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between text-sm text-custom-gray-600">
                    <div>Created</div>
                    <div className="text-right text-sm font-semibold text-custom-black dark:text-white">
                      {new Date(dca.start * 1000).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {dca.active && (
                    <button
                      onClick={() => {
                        const tx = DCASDK.stopAndDestroy({
                          coinInType: dca.input.name,
                          coinOutType: dca.output.name,
                          dca: dca.id,
                        });

                        toast.promise(signExecuteAndWaitTransactionBlock(tx), {
                          loading: "Loading...",
                          success: "DCA Stopped",
                          error: "Failed to stop DCA",
                        });
                      }}
                      className="mt-5 w-full rounded-lg bg-custom-dark-500 py-4 text-base font-semibold text-custom-gray-25 dark:bg-custom-dark-700"
                    >
                      Close and Withdraw
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 rounded-lg bg-custom-gray-100 p-4 dark:bg-custom-dark-400">
                <div className="grid grid-cols-3 px-2 text-xs font-medium uppercase text-custom-gray-600 lg:grid-cols-5">
                  {/* Headers */}
                  <div>From</div>
                  <div className="hidden text-center lg:block">Rate</div>
                  <div className="text-center">To</div>
                  <div className="hidden text-center lg:block">Date</div>
                  <div className="text-right">Detail</div>
                </div>
                <div className="flex flex-col gap-1">
                  {dca.orders.map((order) => (
                    <div
                      key={order._id}
                      className="grid grid-cols-3 rounded-md bg-custom-gray-150 p-2 px-2 text-xs font-medium text-custom-black dark:bg-custom-dark-500 dark:text-custom-gray-25 lg:grid-cols-5"
                    >
                      <div className="flex flex-row items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={sellInfo.iconUrl as string}
                            alt={sellInfo.symbol}
                            width={12}
                            height={12}
                          />
                          <AvatarFallback className="bg-dark-gray-500 text-custom-gray-50 dark:text-custom-dark-800 ">
                            {sellInfo.symbol}
                          </AvatarFallback>
                        </Avatar>
                        {BigNumber(order.input_amount)
                          .div(10 ** sellInfo.decimals)
                          .toFixed(1)}{" "}
                        {sellInfo.symbol}
                      </div>
                      <div className="hidden items-center justify-center lg:flex">
                        {BigNumber(order.input_amount)
                          .div(BigNumber(order.output_amount))
                          .toFixed(1)}{" "}
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={buyInfo.iconUrl as string}
                            alt={buyInfo.symbol}
                            width={12}
                            height={12}
                          />
                          <AvatarFallback className="bg-dark-gray-500 text-custom-gray-50 dark:text-custom-dark-800 ">
                            {buyInfo.symbol}
                          </AvatarFallback>
                        </Avatar>
                        {BigNumber(order.output_amount)
                          .div(10 ** buyInfo.decimals)
                          .toFixed(1)}{" "}
                        {buyInfo.symbol}
                      </div>
                      <div className="hidden items-center justify-center text-nowrap lg:flex">
                        {/* Format 24/07/28, 21:12 */}
                        {new Date(order.timestampMs).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "numeric",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                      <a
                        href={`https://suivision.xyz/txblock/${order.digest}`}
                        target="_blank"
                      >
                        <div className="flex items-center justify-end">
                          <ArrowSquareIn className="h-5 w-5" />
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </div>
    </AccordionItem>
  );
};
