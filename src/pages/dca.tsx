import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import {
  NORMALIZED_SUI_COINTYPE,
  NORMALIZED_USDT_COINTYPE,
} from "@/lib/coinType";
import { DCA } from "@/views/DCA";
import { DCASchema, DCASchemaType } from "@/views/DCA/DCA.types";

const Page = () => {
  const form = useForm<DCASchemaType>({
    resolver: zodResolver(DCASchema),
    defaultValues: {
      sell: "0",
      every: "30",
      time_scale: 1,
      over: "2",
      minPrice: "0",
      maxPrice: "0",
      token_in: NORMALIZED_SUI_COINTYPE,
      token_out: NORMALIZED_USDT_COINTYPE,
    },
  });

  return (
    <FormProvider {...form}>
      <DCA />
    </FormProvider>
  );
};

export default Page;
Page.roundedFully = true;
