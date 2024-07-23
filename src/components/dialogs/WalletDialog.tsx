import Image from "next/image";

import { useWallet } from "@suiet/wallet-kit";
import { toast } from "sonner";
import { useIsClient } from "usehooks-ts";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWalletContext } from "@/context/WalletContext";
import useIsAndroid from "@/hooks/useIsAndroid";
import useIsiOS from "@/hooks/useIsiOS";
import { Wallet, useListWallets } from "@/lib/wallets";

export const WalletDialog = () => {
  const { mainWallets } = useListWallets();
  const { connected, connecting } = useWallet();
  const isClient = useIsClient();

  if (!isClient || connecting) {
    return null;
  }

  return (
    <Dialog open={!connected && !connecting}>
      <DialogContent blur hideCloseButton className="max-w-md">
        <DialogHeader className="items-center justify-center">
          <DialogTitle>Connect a Wallet</DialogTitle>
          <DialogDescription className="text-balance text-center">
            You need a wallet to interact with Patara. Connect your wallet to
            get started.
          </DialogDescription>
        </DialogHeader>
        <main className="flex flex-col gap-5">
          <section className="flex flex-col gap-2">
            {mainWallets.map((wallet) => (
              <WalletItem key={wallet.id} wallet={wallet} />
            ))}
            {mainWallets.length === 0 && (
              <p className="flex items-center justify-center text-sm font-medium text-gray-700">
                No wallets detected. Please install a Sui wallet.
              </p>
            )}
          </section>
        </main>
        <DialogFooter className="items-center justify-center">
          <div className="flex w-full flex-col text-center text-xs font-normal text-custom-gray-600">
            <div>By connecting a wallet, you accept</div>
            <div>
              Patara&apos;s{" "}
              <a
                href="https://patara.app"
                className="text-primary-500 dark:text-primary-300"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                Terms of Service
              </a>{" "}
              and consent to its
            </div>
            <a
              href="https://patara.app"
              className="text-primary-500 dark:text-primary-300"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              Privacy Policy.
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const WalletItem = ({ wallet }: { wallet: Wallet }) => {
  const { selectWallet } = useWalletContext();

  const isiOS = useIsiOS();
  const isAndroid = useIsAndroid();

  const platform: keyof Wallet["downloadUrls"] = isiOS
    ? "iOS"
    : isAndroid
      ? "android"
      : "browserExtension";
  const downloadUrl = wallet.downloadUrls[platform];

  const onClick = async () => {
    if (!wallet.isInstalled) {
      window.open(downloadUrl, "_blank");
      return;
    }

    try {
      await selectWallet(wallet.name);
      toast.info(`Connected ${wallet.name}`);
    } catch (err) {
      toast.error(`Failed to connect ${wallet.name}`, {
        description: "Please try a different wallet.",
      });
      console.error(err);
    }
  };

  if (!wallet.isInstalled && !downloadUrl) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between gap-2 rounded-lg bg-custom-gray-75 px-5  py-3 text-sm text-custom-black transition-all duration-500  hover:bg-custom-gray-100 dark:bg-custom-dark-600 dark:text-white  hover:dark:bg-custom-dark-400"
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          src={wallet.logoUrl ?? ""}
          alt={wallet.name}
          className="h-8 w-8 rounded-full"
          width={32}
          height={32}
        />
        {wallet.name}
      </div>
      <div className="text-xs font-medium text-primary-500 transition-all duration-500 hover:text-primary-600 dark:text-primary-300">
        {wallet.isInstalled ? "Installed" : "Install"}
      </div>
    </button>
  );
};
