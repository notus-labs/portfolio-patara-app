import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Manage all your wallets, coins, and NFTs in one platform. All DeFi in One UI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="description" content="Patara - All DeFi in One UI" />
        <meta property="og:image" content="/og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@notuslabs" />
        <meta name="twitter:creator" content="@notuslabs" />
        <meta name="twitter:title" content="Patara - All DeFi in One UI" />
        <meta
          name="twitter:description"
          content="Manage all your wallets, coins, and NFTs in one platform. All DeFi in One UI"
        />
        <meta name="twitter:image" content="/og.jpg" />
        <meta property="og:url" content="https://patara.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Patara - All DeFi in One UI" />
        <meta
          property="og:description"
          content="Manage all your wallets, coins, and NFTs in one platform. All DeFi in One UI"
        />
        <meta property="og:image" content="/og.jpg" />
        <meta name="author" content="Notus Labs" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="DeFi, NFT, Wallets, Coins, Crypto" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
