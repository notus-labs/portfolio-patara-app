import { useSearchParams } from "next/navigation";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DevInspectTransactionBlockParams,
  SuiClient,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { WalletAccount } from "@mysten/wallet-standard";
import { useWallet } from "@suiet/wallet-kit";
import { toast } from "sonner";

interface WalletContext {
  accounts: readonly WalletAccount[];
  account?: WalletAccount;
  selectAccount: (address: string, addressNameServiceName?: string) => void;
  address?: string;
  isImpersonatingAddress?: boolean;
  selectWallet: (name: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signExecuteAndWaitTransactionBlock: (
    suiClient: SuiClient,
    txb: Transaction,
  ) => Promise<SuiTransactionBlockResponse>;
}

const WalletContext = createContext<WalletContext>({
  accounts: [],
  account: undefined,
  selectAccount: () => {
    throw new Error("WalletContextProvider not initialized");
  },
  address: undefined,
  isImpersonatingAddress: false,
  selectWallet: async () => {
    throw new Error("WalletContextProvider not initialized");
  },
  disconnectWallet: async () => {
    throw new Error("WalletContextProvider not initialized");
  },
  signExecuteAndWaitTransactionBlock: async () => {
    throw new Error("WalletContextProvider not initialized");
  },
});

export const useWalletContext = () => useContext(WalletContext);

export function WalletContextProvider({ children }: PropsWithChildren) {
  const {
    chain,
    adapter,
    connected,
    select: selectWallet,
    disconnect: disconnectWallet,
    getAccounts,
  } = useWallet();

  const searchParams = useSearchParams();
  const impersonatedAddress = searchParams?.get("wallet") ?? undefined;

  // Account
  const [accounts, setAccounts] = useState<readonly WalletAccount[]>([]);
  const [accountAddress, setAccountAddress] = useState<string | undefined>(
    undefined,
  );
  useEffect(() => {
    setAccountAddress(
      window.localStorage.getItem("accountAddress") ?? undefined,
    );
  }, []);

  useEffect(() => {
    if (connected) {
      const _accounts = getAccounts();
      setAccounts(_accounts);

      if (_accounts.length === 0) {
        // NO ACCOUNTS (should not happen) - set to undefined
        setAccountAddress(undefined);
        return;
      }

      if (accountAddress) {
        const account = _accounts.find((a) => a.address === accountAddress);
        if (account) {
          // ADDRESS SET + ACCOUNT FOUND - do nothing
          return;
        }

        // ADDRESS SET + NO ACCOUNT FOUND - set to first account's address
        setAccountAddress(_accounts[0].address);
      } else {
        // NO ADDRESS SET - set to first account's address
        setAccountAddress(_accounts[0].address);
      }
    } else {
      setAccounts([]);
    }
  }, [connected, getAccounts, accountAddress, setAccountAddress]);

  const account =
    accounts?.find((a) => a.address === accountAddress) ?? undefined;

  // Tx
  // Note: Do NOT import and use this function directly. Instead, use the signExecuteAndWaitTransactionBlock
  // from AppContext.
  const signExecuteAndWaitTransactionBlock = useCallback(
    async (suiClient: SuiClient, txb: Transaction) => {
      const _address = impersonatedAddress ?? account?.address;
      if (_address) {
        (async () => {
          try {
            const simResult = await suiClient.devInspectTransactionBlock({
              sender: _address,
              transactionBlock:
                txb as unknown as DevInspectTransactionBlockParams["transactionBlock"],
            });

            if (simResult.error) {
              throw simResult.error;
            }
          } catch (err) {
            console.error(err);
            // throw err; - Do not rethrow error
          }
        })(); // Do not await
      }

      if (!chain) throw new Error("Missing chain");
      if (!adapter) throw new Error("Missing adapter");
      if (!account) throw new Error("Missing account");

      try {
        const signedTxb = await adapter.signTransaction({
          transaction: txb,
          account,
          chain: chain.id as `${string}::${string}`,
        });

        const res = await suiClient.executeTransactionBlock({
          transactionBlock: signedTxb.bytes,
          signature: signedTxb.signature,
          options: {
            showEffects: true,
          },
        });

        await suiClient.waitForTransaction({
          digest: res.digest,
        });

        return res;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    [impersonatedAddress, account, chain, adapter],
  );

  // Context
  const contextValue = useMemo(
    () => ({
      accounts,
      account,
      selectAccount: (_address: string, addressNameServiceName?: string) => {
        const _account = accounts.find((a) => a.address === _address);
        if (!_account) return;

        setAccountAddress(_address);
        toast.info(
          `Switched to ${_account?.label ? _account.label : (addressNameServiceName ?? _address)}`,
          {
            description: _account?.label
              ? (addressNameServiceName ?? _address)
              : undefined,
          },
        );
      },
      address: impersonatedAddress ?? account?.address,
      isImpersonatingAddress: !!impersonatedAddress,
      selectWallet,
      disconnectWallet: async () => {
        await disconnectWallet();
        toast.info("Disconnected wallet");
      },
      signExecuteAndWaitTransactionBlock,
    }),
    [
      accounts,
      account,
      setAccountAddress,
      impersonatedAddress,
      selectWallet,
      disconnectWallet,
      signExecuteAndWaitTransactionBlock,
    ],
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}
