import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import { usePrice } from "@/hooks/usePrice";
import { updateURL } from "@/lib/url";

import { DCASchemaType } from "./DCA.types";

export function useChangeUrl() {
  const {
    pathname,
    query: { from, to },
  } = useRouter();
  const { control, setValue } = useFormContext<DCASchemaType>();
  const [firstRender, setFirstRender] = useState(true);

  const coinInType = useWatch({
    control,
    name: `token_in`,
  });

  const coinOutType = useWatch({
    control,
    name: `token_out`,
  });

  const { data: coinInPrice } = usePrice(coinInType);
  const { data: coinOutPrice } = usePrice(coinOutType);

  const exchangeRate =
    coinInPrice && coinOutPrice ? coinInPrice / coinOutPrice : undefined;

  useEffect(() => {
    if (coinInType && coinOutType) {
      const searchParams = new URLSearchParams();
      searchParams.set("from", coinInType);
      searchParams.set("to", coinOutType);

      updateURL(`${pathname}?${searchParams.toString()}`);
    }
  }, [coinInType, coinOutType, pathname]);

  useEffect(() => {
    if (from && to && firstRender && coinInPrice && exchangeRate) {
      setValue("token_in", from as `0x${string}`);
      setValue("token_out", to as `0x${string}`);
      setFirstRender(false);
      setValue("minPrice", exchangeRate.toFixed(5));
      setValue("maxPrice", (exchangeRate * 1.01).toFixed(5));
    }
  }, [
    from,
    to,
    setValue,
    firstRender,
    coinInPrice,
    coinOutPrice,
    exchangeRate,
  ]);

  return;
}
