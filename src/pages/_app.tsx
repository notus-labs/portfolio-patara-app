import "@/styles/globals.css";
import "@suiet/wallet-kit/style.css";
import "@/lib/abortSignalPolyfill";

import "react-loading-skeleton/dist/skeleton.css";

import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import { ReactNode } from "react";

import { WalletProvider } from "@suiet/wallet-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";

import { WalletDialog } from "@/components/dialogs/WalletDialog";
import { AccountDrawer } from "@/components/drawers/AccountDrawer";
import { MenuDrawer } from "@/components/drawers/MenuDrawer";
import { Layout } from "@/components/layout/Layout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Toaster from "@/components/shared/Toaster";
import { AppContextProvider } from "@/context/AppContext";
import { WalletContextProvider } from "@/context/WalletContext";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: AppProps["Component"] & {
    getLayout?: (page: ReactNode) => ReactNode;
    roundedFully?: boolean;
    showMobileHeader?: boolean;
    heightFull?: boolean;
    paddingZero?: boolean;
  };
}) {
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <Layout
        roundedFully={Component.roundedFully}
        showMobileHeader={Component.showMobileHeader}
        heightFull={Component.heightFull}
        paddingZero={Component.paddingZero}
      >
        {page}
      </Layout>
    ));

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
      <main id="__app_main" className={cn(inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <WalletProvider>
              <WalletContextProvider>
                <AppContextProvider>
                  <div
                    className={cn(
                      "bg-custom-gray-200 text-custom-black dark:bg-custom-dark-900 dark:text-white",
                    )}
                  >
                    {getLayout(<Component {...pageProps} />)}
                  </div>
                  <WalletDialog />
                  <MenuDrawer />
                  <AccountDrawer />
                </AppContextProvider>
              </WalletContextProvider>
            </WalletProvider>
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </main>
    </>
  );
}
