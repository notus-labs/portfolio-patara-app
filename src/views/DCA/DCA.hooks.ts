import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useFormContext, useWatch } from "react-hook-form";

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

  useEffect(() => {
    if (coinInType && coinOutType) {
      const searchParams = new URLSearchParams();
      searchParams.set("from", coinInType);
      searchParams.set("to", coinOutType);

      updateURL(`${pathname}?${searchParams.toString()}`);
    }
  }, [coinInType, coinOutType, pathname]);

  useEffect(() => {
    if (from && to && firstRender) {
      setValue("token_in", from as `0x${string}`);
      setValue("token_out", to as `0x${string}`);
      setFirstRender(false);
    }
  }, [from, to, setValue, firstRender]);

  return;
}
