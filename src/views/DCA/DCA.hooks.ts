import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import invariant from "ts-invariant";

import { useAppContext } from "@/context/AppContext";
import { useWalletContext } from "@/context/WalletContext";
import { usePrice } from "@/hooks/usePrice";
import { updateURL } from "@/lib/url";
import { AF_CLIENT } from "@/sdk/utils/client";

import { newDCA } from "@/sdk";

import { DCASchemaType } from "./DCA.types";
import { afterDotItsTrailingZeros } from "./DCA.utils";

const useAfRouter = () => AF_CLIENT.Router();

export function useChangeUrl() {
  const {
    query: { from, to },
  } = useRouter();
  const { setValue } = useFormContext<DCASchemaType>();
  const [firstRender, setFirstRender] = useState(true);
  const { coinInType, coinOutType, exchangeRate } = useDCAContext();

  useEffect(() => {
    if (coinInType && coinOutType) {
      const searchParams = new URLSearchParams();
      searchParams.set("from", coinInType);
      searchParams.set("to", coinOutType);

      // if url is the same, dont change
      if (searchParams.toString() !== location.search) {
        updateURL(`/dca?${searchParams.toString()}`);
      }
    }
  }, [coinInType, coinOutType]);

  useEffect(() => {
    if (!firstRender) return;

    if (from && to) {
      setValue("token_in", from as `0x${string}`);
      setValue("token_out", to as `0x${string}`);
      setFirstRender(false);
    }

    if (exchangeRate) {
      setValue("minPrice", exchangeRate.toFixed(5));
      setValue("maxPrice", (exchangeRate * 1.01).toFixed(5));
    }
  }, [from, to, setValue, firstRender, exchangeRate]);

  return;
}

export function useDCAContext() {
  const { control, setValue } = useFormContext<DCASchemaType>();
  const {
    coinBalancesMap,
    coinMetadataMap,
    client,
    signExecuteAndWaitTransactionBlock,
    refetchCoinBalances,
  } = useAppContext();
  const { address } = useWalletContext();
  const router = useAfRouter();

  const coinInType = useWatch({
    control,
    name: `token_in`,
  });

  const coinOutType = useWatch({
    control,
    name: `token_out`,
  });

  const coinInAmount = useWatch({
    control,
    name: `sell`,
  });

  const coinInRawAmount = useWatch({
    control,
    name: `sell_raw`,
  });

  const every = useWatch({
    control,
    name: `every`,
  });

  const over = useWatch({
    control,
    name: `over`,
  });

  const minPrice = useWatch({
    control,
    name: `minPrice`,
  });

  const maxPrice = useWatch({
    control,
    name: `maxPrice`,
  });

  const timeScale = useWatch({
    control,
    name: `time_scale`,
  });

  const advancedPriceStrategyOpen = useWatch({
    control,
    name: "advancedPriceStrategy",
  });

  const loading = useWatch({
    control,
    name: `buy_loading`,
  });

  const { data: coinInPrice } = usePrice(coinInType);
  const { data: coinOutPrice } = usePrice(coinOutType);

  const coinIn = coinInType ? coinMetadataMap[coinInType] : undefined;
  const coinOut = coinOutType ? coinMetadataMap[coinOutType] : undefined;
  const exchangeRate =
    coinInPrice && coinOutPrice ? coinInPrice / coinOutPrice : undefined;

  const balance = coinInType ? coinBalancesMap[coinInType] : undefined;

  const insufficientBalance =
    balance && coinInRawAmount
      ? coinInRawAmount
          .div(BigNumber(10).pow(coinIn?.decimals || 9))
          .gte(balance.balance)
      : true;

  useEffect(() => {
    if (
      !coinInAmount ||
      coinInAmount === "0" ||
      coinInAmount === "0." ||
      afterDotItsTrailingZeros(coinInAmount)
    ) {
      setValue("buy", "0");
      setValue("buy_raw", BigNumber(0));
    }
  }, [coinInAmount, coinInPrice, exchangeRate, setValue]);

  useEffect(() => {
    const abortController = new AbortController();

    // we should set the buy amount to the current price
    if (
      coinIn &&
      coinOut &&
      coinInRawAmount &&
      coinInRawAmount !== BigNumber(0) &&
      !isNaN(coinInRawAmount.toNumber()) &&
      coinInRawAmount
    ) {
      setValue("buy_loading", true);

      router
        .getCompleteTradeRouteGivenAmountIn(
          {
            coinInType: coinInType,
            coinInAmount: BigInt(coinInRawAmount.toString()),
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
          setValue("buy_raw", BigNumber(route.coinOut.amount.toString()));
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

  const disableTrade =
    loading ||
    !coinIn ||
    !coinOut ||
    !coinInRawAmount ||
    parseInt(every) === 0 ||
    isNaN(parseInt(every)) ||
    parseInt(over) === 0 ||
    isNaN(parseInt(over)) ||
    insufficientBalance;

  async function onSubmit() {
    toast.promise(
      async () => {
        if (disableTrade) return;

        invariant(address, "Address is required");
        invariant(exchangeRate, "Exchange rate is required");

        const tx = await newDCA(
          client,
          address,
          BigInt(coinInRawAmount.toString()),
          +every,
          +over,
          timeScale,
          coinInType,
          coinOutType,
          advancedPriceStrategyOpen
            ? BigInt(
                BigNumber(minPrice)
                  .multipliedBy(BigNumber(10 ** coinOut.decimals))
                  .toString(),
              )
            : undefined,
          advancedPriceStrategyOpen
            ? BigInt(
                BigNumber(maxPrice)
                  .multipliedBy(BigNumber(10 ** coinOut.decimals))
                  .toString(),
              )
            : undefined,
        );

        await signExecuteAndWaitTransactionBlock(tx);
      },
      {
        loading: "Creating DCA",
        success: "DCA created",
        error: (error) => `Error: ${error.message}`,
        finally: () => {
          refetchCoinBalances();
        },
      },
    );
  }

  return {
    coinInType,
    coinOutType,
    coinIn,
    coinOut,
    exchangeRate,
    balance,
    insufficientBalance,
    disableTrade,
    onSubmit,
  };
}
