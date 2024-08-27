import { z } from "zod";

export const DCAOObjectsSchema = z.array(
  z.object({
    input: z.object({ name: z.string() }),
    output: z.object({ name: z.string() }),
    _id: z.string(),
    id: z.string(),
    owner: z.string(),
    delegatee: z.string(),
    every: z.number(),
    orderCount: z.number(),
    remainingOrders: z.number(),
    start: z.number(),
    timeScale: z.number(),
    inputBalance: z.string(),
    amountPerTrade: z.string(),
    min: z.string(),
    max: z.string(),
    active: z.boolean(),
    canceled: z.boolean(),
    isTrading: z.boolean(),
    feePercent: z.string(),
    lastTrade: z.number(),
    cooldown: z.number(),
    __v: z.number(),
    orders: z.array(
      z.object({
        input: z.object({ name: z.string() }),
        output: z.object({ name: z.string() }),
        _id: z.string(),
        fee: z.string(),
        input_amount: z.string(),
        output_amount: z.string(),
        dca: z.string(),
        timestampMs: z.number(),
        digest: z.string(),
        __v: z.number(),
      }),
    ),
  }),
);

export type DCAObject = z.infer<typeof DCAOObjectsSchema>[0];

export const DCAOrderSchema = z.array(
  z.object({
    input: z.object({ name: z.string() }),
    output: z.object({ name: z.string() }),
    _id: z.string(),
    fee: z.string(),
    input_amount: z.string(),
    output_amount: z.string(),
    dca: z.string(),
    timestampMs: z.number(),
    digest: z.string(),
    __v: z.number(),
  }),
);

export type DCAOrder = z.infer<typeof DCAOrderSchema>[0];
