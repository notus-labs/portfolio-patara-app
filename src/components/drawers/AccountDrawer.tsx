import { SignOut } from "@phosphor-icons/react";
import { Avatar } from "@radix-ui/react-avatar";
import { useWallet } from "@suiet/wallet-kit";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { useAppContext } from "@/context/AppContext";
import { useWalletContext } from "@/context/WalletContext";
import { formatAddress } from "@/lib/format";

import { AvatarFallback, AvatarImage } from "../ui/avatar";

export const AccountDrawer = () => {
  const { isAccountDrawerOpen, toggleAccountDrawerOff } = useAppContext();
  const { account, address } = useWalletContext();
  const avatar = account?.icon || "";
  const avatarFallback = "A";
  const formattedAddress = address ? formatAddress(address) : "";
  const { disconnect } = useWallet();

  return (
    <Drawer
      direction="right"
      open={isAccountDrawerOpen}
      onClose={toggleAccountDrawerOff}
    >
      <DrawerContent
        onClose={toggleAccountDrawerOff}
        className="left-auto h-full w-64 rounded-bl-2xl rounded-br-none rounded-tl-2xl rounded-tr-none"
      >
        <DrawerHeader>
          <div className="flex flex-row items-center gap-3">
            <Avatar className="h-[60px] w-[60px] rounded-full border-2 border-primary-500 bg-custom-black">
              <AvatarImage src={avatar} alt={address} />
              <AvatarFallback className="text-custom-gray-50">
                {avatarFallback || "AC"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold text-custom-black">
                Account
              </div>
              <div className="text-sm font-normal text-custom-gray-600">
                {formattedAddress}
              </div>
            </div>
          </div>
        </DrawerHeader>

        <DrawerFooter className="pl-5">
          <button
            onClick={() => {
              disconnect().then(() => {
                toggleAccountDrawerOff();
              });
            }}
            className="flex w-full items-center gap-2 rounded-lg border border-custom-gray-100 px-5 py-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-custom-black text-white">
              <SignOut className="m-auto h-5 w-5" />
            </div>
            <div className="text-sm font-semibold text-custom-black">
              Logout
            </div>
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
