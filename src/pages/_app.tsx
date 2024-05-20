import "@/styles/globals.css";
import "@suiet/wallet-kit/style.css";
import "@/lib/abortSignalPolyfill";

import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactNode } from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { fontClassNames } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: AppProps["Component"] & {
    getLayout?: (page: ReactNode) => ReactNode;
  };
}) {
  const getLayout = Component.getLayout ?? ((page) => <>{page}</>);

  return (
    <>
      <SpeedInsights />
      <Analytics />
      <Head>
        <title>Patara - All DeFi in One UI</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </Head>
      <main id="__app_main" className={cn(...fontClassNames)}>
        {getLayout(<Component {...pageProps} />)}
      </main>
    </>
  );
}
