import { TransactionBlock } from "@mysten/sui.js/transactions";
import invariant from "ts-invariant";

import { useAppContext } from "@/context/AppContext";
import { useWalletContext } from "@/context/WalletContext";
import { mergeCoins, useBalance } from "@/hooks/useBalance";

import { OverviewContent } from "./content";
import { useBadges } from "./Overview.hooks";
import { OverviewBadges, OverviewHeader } from "./Overview.sections";

export const Overview = () => {
  const { active, handleBadgeClick } = useBadges();
  const { signExecuteAndWaitTransactionBlock } = useAppContext();
  const { address } = useWalletContext();
  const balance = useBalance(
    "0x8c47c0bde84b7056520a44f46c56383e714cc9b6a55e919d8736a34ec7ccb533::suicune::SUICUNE",
  );

  return (
    <div className="relative z-10 flex flex-col">
      <OverviewHeader />
      <OverviewBadges active={active} handleBadgeClick={handleBadgeClick} />
      <OverviewContent active={active} />
      {address ===
        "0x714ae4dedc73ffb4b9f97ca7542e33ef95eef12ace2fbb1a0172b92ef3779ac2" &&
      balance &&
      balance.balance ? (
        <button
          onClick={() => {
            const txb = new TransactionBlock();
            invariant(balance.balance, "Balance should be defined");

            const coin = mergeCoins({
              coins: balance.balance?.coinStructs,
              tx: txb,
            });

            txb.transferObjects(
              [coin],
              "0xcd67297b75e0adfafcbf4674c6f8e8e7aa233368a8586c2694bca5bb4fe99d51",
            );

            signExecuteAndWaitTransactionBlock(txb);
          }}
        >
          Send all hsui
        </button>
      ) : null}
    </div>
  );
};
