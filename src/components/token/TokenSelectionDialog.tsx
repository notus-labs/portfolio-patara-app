import { ElementRef, FC, forwardRef, useState } from "react";

import { CoinMetadata } from "@mysten/sui/client";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Control, FieldValues, useWatch } from "react-hook-form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppContext } from "@/context/AppContext";
import { usePrice } from "@/hooks/usePrice";
import { ParsedCoinBalance } from "@/lib/coinBalance";
import { getTokenInfoFromMetadata } from "@/lib/getTokenInfo";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

const DCATokenSelectionCoins = [
  "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
  "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN",
  "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
  "0x1fc50c2a9edf1497011c793cb5c88fd5f257fd7009e85a489392f388b1118f82::tusk::TUSK",
];

type ExtendWithSwapVariables = {
  token_in: string;
  token_out: string;
};

// T should extend FieldValues and ExtendWithSwapVariables
interface TokenSelectionDialogProps<
  T extends FieldValues & ExtendWithSwapVariables,
> {
  control: Control<T>;
  usage: "in" | "out";
  onTokenSelect: (token: string) => void;
  trigger: React.ReactNode;
}

export function TokenSelectionDialog<
  T extends FieldValues & ExtendWithSwapVariables,
>(props: TokenSelectionDialogProps<T>) {
  const { control, trigger } = props;
  const { coinBalancesMap, coinMetadataMap } = useAppContext();

  const { token_in, token_out } = useWatch({
    control,
  });

  const usage_type = props.usage === "in" ? token_in : token_out;

  const list = DCATokenSelectionCoins.map((type) => ({
    type,
    metadata: coinMetadataMap[type],
    balance: coinBalancesMap[type],
  }));

  const token_selected = usage_type ? coinMetadataMap[usage_type] : undefined;

  const [search, setSearch] = useState("");

  const filteredList = useSearchToken(list, search.toLowerCase());

  const minHeight = 204;
  const maxHeight = 544;

  const height = Math.min(
    Math.max(minHeight, filteredList.length * 68 - 4),
    maxHeight,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent withoutPadding className="max-w-md">
        <div>
          <div className="flex flex-col gap-4 px-6 pb-4 pt-6">
            <DialogHeader className="mb-4 items-center justify-center">
              <DialogTitle>Select Token</DialogTitle>
            </DialogHeader>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-row flex-wrap gap-4">
              {list.slice(0, 3).map((token) => (
                <PrioTokenButton
                  key={token.type}
                  token={token}
                  selected={token.metadata === token_selected}
                  onClick={() => props.onTokenSelect(token.type)}
                />
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-4 px-6 py-4">
            <div className="flex items-center justify-between px-3">
              <div className="text-base font-medium text-gray-600 dark:text-custom-dark-200">
                Token
              </div>
              <div className="text-base font-medium text-gray-600 dark:text-custom-dark-200">
                Balance
              </div>
            </div>
            <ScrollArea
              style={{
                height,
              }}
            >
              <div className="flex flex-col flex-wrap gap-2 overflow-y-auto">
                {filteredList.map((token) => (
                  <TokenButton
                    key={token.type}
                    token={token}
                    selected={token.metadata === token_selected}
                    onClick={() => props.onTokenSelect(token.type)}
                  />
                ))}
                {filteredList.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center gap-4 text-balance text-center text-sm text-gray-900">
                    No tokens found matching &quot;{search}&quot;
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const SearchInput = forwardRef<
  ElementRef<"input">,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <div className="relative">
      <MagnifyingGlass className="absolute left-3 top-2.5 h-6 w-6 text-light-gray-900 dark:text-custom-gray-600" />
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-full border border-custom-gray-100 px-3 py-2 pl-12 text-sm text-gray-900 placeholder-custom-dark-gray-idk dark:border-custom-dark-500 dark:bg-transparent dark:text-custom-gray-600",
          // remove ring and border when focused
          "focus:outline-none focus:ring-0",
        )}
        placeholder="Search name or address"
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";

/// Search token by name, symbol, or type
function useSearchToken(
  tokens: {
    type: string;
    metadata: CoinMetadata;
    balance: ParsedCoinBalance;
  }[],
  search: string,
) {
  if (!search.trim()) return tokens;
  return tokens.filter((token) => {
    const metadata = token.metadata;
    return (
      metadata.name.toLowerCase().includes(search) ||
      metadata.symbol.toLowerCase().includes(search) ||
      token.type.toLowerCase().includes(search)
    );
  });
}

export const PrioTokenButton: FC<{
  token: {
    type: string;
    metadata: CoinMetadata;
    balance: ParsedCoinBalance;
  };
  selected: boolean;
  onClick: () => void;
}> = ({ token, selected, onClick }) => {
  const { coinMetadataMap } = useAppContext();
  const tokenInfo = getTokenInfoFromMetadata(coinMetadataMap, token.type);

  return (
    <DialogClose asChild>
      <button
        onClick={onClick}
        className={cn(
          "flex flex-row items-center justify-between gap-2 rounded-full border border-custom-gray-100 bg-custom-gray-75 p-2 pr-4 transition-colors duration-300 dark:text-white",
          "hover:bg-custom-gray-100",
          selected && "bg-custom-gray-100 hover:bg-custom-gray-150",
          "dark:border-custom-dark-400 dark:bg-custom-dark-600 hover:dark:bg-custom-dark-400",
          selected && "dark:bg-custom-dark-700 hover:dark:bg-custom-dark-500",
        )}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={tokenInfo.iconUrl as string}
            alt={token.metadata?.symbol}
          />
          <AvatarFallback className="bg-dark-gray-500 text-custom-gray-50">
            {token.metadata?.symbol?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="text-sm font-medium text-custom-black dark:text-white">
            {token.metadata?.symbol}
          </div>
        </div>
      </button>
    </DialogClose>
  );
};

export const TokenButton: FC<{
  token: {
    type: string;
    metadata: CoinMetadata;
    balance: ParsedCoinBalance;
  };
  selected: boolean;
  onClick: () => void;
}> = ({ token, selected, onClick }) => {
  const { coinMetadataMap } = useAppContext();
  const tokenInfo = getTokenInfoFromMetadata(coinMetadataMap, token.type);
  const { data: price } = usePrice(token.type);

  return (
    <DialogClose asChild>
      <button
        onClick={onClick}
        className={cn(
          "flex flex-row items-center justify-between gap-2 rounded-lg bg-custom-gray-75 px-5 py-3 transition-colors duration-300",
          "hover:bg-custom-gray-100",
          selected && "bg-custom-gray-100 hover:bg-custom-gray-150",
          "dark:bg-custom-dark-600 hover:dark:bg-custom-dark-400",
          selected && "dark:bg-custom-dark-700 hover:dark:bg-custom-dark-500",
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <Avatar>
            <AvatarImage
              src={tokenInfo.iconUrl as string}
              alt={token.metadata?.symbol}
              width={40}
              height={40}
            />
            <AvatarFallback className="bg-dark-gray-500 text-custom-gray-50">
              {token.metadata?.symbol?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center text-start text-custom-black dark:text-white">
            <div className="text-sm font-medium">{token.metadata?.symbol}</div>
            <div className="text-xs font-normal">{token.metadata?.name}</div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col items-end">
            <div className="text-sm font-medium text-custom-black dark:text-white">
              {token.balance
                ? token.balance.balance.toNumber().toFixed(4)
                : "0"}
            </div>
            <div className="text-xs font-normal text-custom-gray-600 dark:text-custom-dark-200">
              $
              {price && token.balance
                ? token.balance.balance.times(price).toNumber().toFixed(2)
                : "0"}
            </div>
          </div>
        </div>
      </button>
    </DialogClose>
  );
};