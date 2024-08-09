import { CaretDown } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import {
  InputWithExtra,
  PercentageBadge,
  SwapInput,
  SwapInputs,
} from "./DCA.components";
import { useChangeUrl, useDCAContext } from "./DCA.hooks";
import { DCASchemaType } from "./DCA.types";

export const DCA = () => {
  const { control, setValue } = useFormContext<DCASchemaType>();
  const {
    coinIn,
    coinOut,
    exchangeRate,
    balance,
    insufficientBalance,
    disableTrade,
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

  return (
    <div className="mt-2 flex h-full w-full items-center justify-center">
      <div className="w-full max-w-[480px] rounded-lg bg-custom-gray-50 p-4  dark:bg-custom-dark-800">
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
                    {Array.from({ length: 4 }).map((_, i) => (
                      <DropdownMenuItem
                        key={i}
                        className={cn(
                          "flex cursor-pointer items-center justify-center rounded-[4px] bg-custom-gray-75 dark:bg-custom-dark-600 ",
                          "hover:bg-custom-gray-25 hover:text-custom-black dark:hover:bg-custom-dark-400 hover:dark:text-white",
                        )}
                        onClick={() => setValue("time_scale", i + 1)}
                      >
                        {
                          {
                            1: "Minute",
                            2: "Hour",
                            3: "Day",
                            4: "Week",
                          }[i + 1]
                        }
                      </DropdownMenuItem>
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
          <div className="grid grid-cols-2 gap-2">
            <InputWithExtra label="minPrice" text="Min price" />
            <InputWithExtra label="maxPrice" text="Max price" />
          </div>
          <AnimatePresence>
            {coinIn && coinOut && exchangeRate && (
              <motion.div
                className="flex flex-row items-center justify-between rounded-lg border border-custom-gray-100 p-2  px-4 dark:border-custom-dark-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-sm font-medium text-custom-gray-600">
                  Current {coinIn.symbol}/{coinOut.symbol} rate
                </div>
                <div className="text-right text-xs text-custom-black dark:text-white ">
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
    </div>
  );
};
