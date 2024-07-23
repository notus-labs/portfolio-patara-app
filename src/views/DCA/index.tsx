import { useEffect } from "react";

import { CaretDown } from "@phosphor-icons/react";
import BigNumber from "bignumber.js";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/context/AppContext";
import { usePrice } from "@/hooks/usePrice";
import { cn } from "@/lib/utils";
import { AF_CLIENT } from "@/sdk/utils/client";

import {
  InputWithExtra,
  PercentageBadge,
  SwapInput,
  SwapInputs,
} from "./DCA.components";
import { useChangeUrl } from "./DCA.hooks";
import { DCASchemaType } from "./DCA.types";

export const useAfRouter = () => AF_CLIENT.Router();

export const DCA = () => {
  const { control, setValue } = useFormContext<DCASchemaType>();
  const { coinBalancesMap, coinMetadataMap } = useAppContext();
  const router = useAfRouter();
  useChangeUrl();

  const coinInAmount = useWatch({
    control,
    name: `sell`,
  });

  const coinInRawAmount = useWatch({
    control,
    name: `sell_raw`,
  });

  const coinInType = useWatch({
    control,
    name: `token_in`,
  });

  const { data: coinInPrice } = usePrice(coinInType);

  const coinOutType = useWatch({
    control,
    name: `token_out`,
  });

  const loading = useWatch({
    control,
    name: `buy_loading`,
  });

  const every = useWatch({
    control,
    name: `every`,
  });

  const over = useWatch({
    control,
    name: `over`,
  });

  const timeScale = useWatch({
    control,
    name: `time_scale`,
  });

  const { data: coinOutPrice } = usePrice(coinOutType);

  const coinIn = coinInType ? coinMetadataMap[coinInType] : undefined;
  const coinOut = coinOutType ? coinMetadataMap[coinOutType] : undefined;
  const exchangeRate =
    coinInPrice && coinOutPrice ? coinInPrice / coinOutPrice : undefined;

  const balance = coinInType ? coinBalancesMap[coinInType] : undefined;

  function afterDotItsTrailingZeros(value: string) {
    const dotIndex = value.indexOf(".");
    return value
      .slice(dotIndex + 1)
      .split("")
      .every((char) => char === "0");
  }

  useEffect(() => {
    // we should set minPrice and maxPrice to the current price
    if (coinInPrice && exchangeRate) {
      setValue("minPrice", exchangeRate.toFixed(5));
      setValue("maxPrice", (exchangeRate * 1.01).toFixed(5));
    }

    // if the coinInAmount is 0, we should set the buy amount to 0
    if (
      !coinInAmount ||
      coinInAmount === "0" ||
      coinInAmount === "0." ||
      afterDotItsTrailingZeros(coinInAmount)
    ) {
      setValue("buy", "0");
      setValue("buy_raw", "0");
      return;
    }
  }, [coinInAmount, coinInPrice, exchangeRate, setValue]);

  useEffect(() => {
    const abortController = new AbortController();

    // we should set the buy amount to the current price
    if (coinOut && coinInRawAmount && coinInRawAmount !== "NaN") {
      setValue("buy_loading", true);

      router
        .getCompleteTradeRouteGivenAmountIn(
          {
            coinInType: coinInType,
            coinInAmount: BigInt(coinInRawAmount),
            coinOutType: coinOutType,
          },
          abortController.signal,
        )
        .then((route) => {
          setValue(
            "buy",
            new BigNumber(route.coinOut.amount.toString())
              .div(new BigNumber(10).pow(coinOut.decimals))
              .toFixed(4),
          );
          setValue("buy_raw", route.coinOut.amount.toString());
          setValue("buy_loading", false);
        })
        .catch(() => {
          setValue("buy_loading", false);
        });
    }

    return () => {
      abortController.abort();
      setValue("buy_loading", false);
    };
  }, [coinInRawAmount, coinInType, coinOut, coinOutType, setValue]);

  const insufficientBalance = balance
    ? new BigNumber(coinInRawAmount).gt(
        balance.balance.multipliedBy(
          new BigNumber(10).pow(coinIn?.decimals || 9),
        ),
      )
    : true;

  return (
    <div className="mt-2 flex h-full w-full items-center justify-center">
      <div className="w-full max-w-[480px] rounded-lg bg-custom-gray-50 p-4">
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
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex grid-cols-2 flex-col gap-2 md:grid">
            <InputWithExtra
              extra={
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button className="flex h-full max-h-[38px] flex-row items-center gap-2 rounded-lg border border-custom-gray-100 bg-custom-gray-50 px-3 py-2 font-semibold">
                      <span className="text-sm text-custom-black">
                        {
                          {
                            1: "Minute",
                            2: "Hour",
                            3: "Day",
                            4: "Week",
                          }[timeScale]
                        }
                      </span>
                      <CaretDown className="h-5 w-5 text-custom-black" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex max-w-32 flex-col gap-1">
                    <DropdownMenuItem
                      className={cn(
                        "flex cursor-pointer items-center justify-center rounded-[4px] bg-custom-gray-75",
                        "hover:bg-custom-gray-25 hover:text-custom-black",
                      )}
                      onClick={() => setValue("time_scale", 1)}
                    >
                      Minute
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={cn(
                        "flex cursor-pointer items-center justify-center rounded-[4px] bg-custom-gray-75",
                        "hover:bg-custom-gray-25 hover:text-custom-black",
                      )}
                      onClick={() => setValue("time_scale", 2)}
                    >
                      Hour
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={cn(
                        "flex cursor-pointer items-center justify-center rounded-[4px] bg-custom-gray-75",
                        "hover:bg-custom-gray-25 hover:text-custom-black",
                      )}
                      onClick={() => setValue("time_scale", 3)}
                    >
                      Day
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={cn(
                        "flex cursor-pointer items-center justify-center rounded-[4px] bg-custom-gray-75",
                        "hover:bg-custom-gray-25 hover:text-custom-black",
                      )}
                      onClick={() => setValue("time_scale", 4)}
                    >
                      Week
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
              text="Every"
              label="every"
            />
            <InputWithExtra
              extra={
                <div className="flex h-full max-h-[38px] flex-row items-center gap-1 rounded-lg border border-custom-gray-100 bg-custom-gray-50 px-3 py-2 font-semibold">
                  <span className="text-sm text-custom-black">Orders</span>
                </div>
              }
              text="Over"
              label="over"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <InputWithExtra label="minPrice" text="Min price" />
            <InputWithExtra label="maxPrice" text="Max price" />
          </div>
          <AnimatePresence>
            {coinIn && coinOut && exchangeRate && (
              <motion.div
                className="flex flex-row items-center justify-between rounded-lg border border-custom-gray-100 p-2 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-sm font-medium text-custom-gray-600">
                  Current {coinIn.symbol}/{coinOut.symbol} rate
                </div>
                <div className="text-right text-xs text-custom-black">
                  ${exchangeRate.toFixed(5)} {coinIn.symbol}/{coinOut.symbol}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="submit"
            className={cn(
              "w-full rounded-lg bg-primary-50 py-5 text-center text-base font-semibold text-primary-500 transition-colors duration-300 hover:bg-primary-100/70",
              "disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:hover:bg-primary-50/50",
            )}
            disabled={
              loading ||
              !coinIn ||
              !coinOut ||
              parseInt(coinInRawAmount) === 0 ||
              isNaN(parseInt(coinInRawAmount)) ||
              parseInt(every) === 0 ||
              isNaN(parseInt(every)) ||
              parseInt(over) === 0 ||
              isNaN(parseInt(over)) ||
              insufficientBalance
            }
          >
            {insufficientBalance
              ? "Insufficient balance"
              : loading
                ? "Loading..."
                : "Start DCA"}
          </button>
        </div>
      </div>
    </div>
  );
};
