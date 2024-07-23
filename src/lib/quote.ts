import { Router } from "aftermath-ts-sdk";

export async function quote(
  router: Router,
  coinInType: string,
  coinOutType: string,
  coinInAmount?: string,
  coinOutAmount?: string,
  way: "sell" | "buy" = "buy",
) {
  if (way === "sell" && coinInAmount) {
    return router.getCompleteTradeRouteGivenAmountOut({
      coinInType,
      coinOutAmount: BigInt(coinInAmount),
      coinOutType,
      slippage: 1,
    });
  } else if (way === "buy" && coinOutAmount) {
    return router.getCompleteTradeRouteGivenAmountIn({
      coinInType,
      coinInAmount: BigInt(coinOutAmount),
      coinOutType,
    });
  }
}
