import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import BigNumber from "bignumber.js";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";

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
      ? balance.balance
          .multipliedBy(BigNumber(10).pow(coinIn?.decimals || 9))
          .lt(coinInRawAmount)
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

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const currentAbortController = abortControllerRef.current;

    // Abort previous request if still active
    if (currentAbortController) {
      currentAbortController.abort();
    }

    abortControllerRef.current = abortController;

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
        })
        .catch(() => {})
        .finally(() => setValue("buy_loading", false));
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [coinInRawAmount, coinInType, coinOut, coinOutType, setValue]);

  const disableTrade =
    loading ||
    !coinIn ||
    !coinOut ||
    !coinInRawAmount ||
    coinInRawAmount.isNaN() ||
    coinInRawAmount.isZero() ||
    parseInt(every) === 0 ||
    isNaN(parseInt(every)) ||
    parseInt(over) === 0 ||
    isNaN(parseInt(over)) ||
    insufficientBalance;

  async function onSubmit() {
    toast.promise(
      async () => {
        if (disableTrade) return;
        if (!coinInPrice) return;
        if (!address) return;

        if (
          coinInRawAmount
            .div(BigNumber(10).pow(coinIn.decimals || 9))
            .multipliedBy(coinInPrice)
            .lt(2)
        ) {
          throw new Error("Input should be more than 2$");
        }

        const amountPerTrade = coinInRawAmount
          .div(BigNumber(10).pow(coinIn?.decimals || 9))
          .div(BigNumber(over));

        const minPricePerOrder = BigNumber(minPrice)
          .multipliedBy(BigNumber(10).pow(coinOut?.decimals || 9))
          .times(amountPerTrade)
          .decimalPlaces(0)
          .toFixed(0);

        const maxPricePerOrder = BigNumber(maxPrice)
          .multipliedBy(BigNumber(10).pow(coinOut?.decimals || 9))
          .times(amountPerTrade)
          .decimalPlaces(0)
          .toFixed(0);

        const tx = await newDCA(
          client,
          address,
          BigInt(coinInRawAmount.toString()),
          +every,
          +over,
          timeScale,
          coinInType,
          coinOutType,
          advancedPriceStrategyOpen && minPricePerOrder
            ? BigInt(minPricePerOrder)
            : undefined,
          advancedPriceStrategyOpen && maxPricePerOrder
            ? BigInt(maxPricePerOrder)
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
