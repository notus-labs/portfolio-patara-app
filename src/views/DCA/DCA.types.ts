import { z } from "zod";

export type DcaPercentageBadgeProps = {
  text: string;
};

export type SwapInputProps = {
  type: "sell" | "buy";
};

export type InputWithExtraProps = {
  text: string;
  label: "every" | "over" | "minPrice" | "maxPrice";
  extra?: React.ReactNode;
};

export const DCASchema = z.object({
  token_in: z.string().min(1, "Select a token"),
  token_out: z.string().min(1, "Select a token"),
  sell: z.string({
    message: "Invalid amount",
  }),
  sell_raw: z.string(),
  buy: z.string({
    message: "Invalid amount",
  }),
  buy_raw: z.string(),
  time_scale: z.number().min(0).max(5),
  every: z
    .string({
      message: "Invalid amount",
    })
    .min(1, "Minimum amount is 1"),
  over: z
    .string({
      message: "Invalid amount",
    })
    .min(1, "Minimum amount is 1"),
  minPrice: z.string({
    message: "Invalid amount",
  }),
  maxPrice: z.string({
    message: "Invalid amount",
  }),
  buy_loading: z.boolean(),
});

export type DCASchemaType = z.infer<typeof DCASchema>;
