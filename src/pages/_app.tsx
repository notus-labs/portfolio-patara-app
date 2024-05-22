import "@/styles/globals.css";
import "@suiet/wallet-kit/style.css";
import "@/lib/abortSignalPolyfill";

import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactNode } from "react";

import { WalletProvider } from "@suiet/wallet-kit";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";

import { WalletDialog } from "@/components/dialogs/WalletDialog";
import { MenuDrawer } from "@/components/drawers/MenuDrawer";
import { Layout } from "@/components/layout/Layout";
import Toaster from "@/components/shared/Toaster";
import { AppContextProvider } from "@/context/AppContext";
import { WalletContextProvider } from "@/context/WalletContext";
import { cn } from "@/lib/utils";

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: AppProps["Component"] & {
    getLayout?: (page: ReactNode) => ReactNode;
  };
}) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <Analytics />
      <Head>
        <title>Patara - All DeFi in One UI</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </Head>
      <main id="__app_main" className={cn(GeistSans.className)}>
        <WalletProvider>
          <WalletContextProvider>
            <AppContextProvider>
              <div className="bg-custom-gray-200">
                {getLayout(<Component {...pageProps} />)}
              </div>
              <WalletDialog />
              <MenuDrawer />
            </AppContextProvider>
          </WalletContextProvider>
        </WalletProvider>
        <Toaster />
      </main>
    </>
  );
}
