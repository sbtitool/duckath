	import "@/app/globals.css";

import type { Viewport } from "next";
import Script from "next/script";
import { getLocale, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/locale";

// ① 用 Next.js 官方 viewport export 替代手动 <meta name="viewport">
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#80D893",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  setRequestLocale(locale);

  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://plantsvsbrainrots.cc";
  const googleAdsenseCode = process.env.NEXT_PUBLIC_GOOGLE_ADCODE || "";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* ② crossOrigin 用 "anonymous" 才符合规范 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {googleAdsenseCode && (
          <meta name="google-adsense-account" content={googleAdsenseCode} />
        )}

        {/* Favicon & Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/imgs/PlantsVsBrainrots-m144x144.png" type="image/png" sizes="144x144" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* 默认 Twitter/X Card — 各页面可通过 generateMetadata 的 twitter 字段覆盖 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Plants vs Brainrots Unblocked - Free Online Games" />
        <meta name="twitter:description" content="Play Plants vs Brainrots unblocked + 600 free online games instantly in your browser." />

        <link rel="preconnect" href="https://img.gamemonetize.com" />
        <link rel="preconnect" href="https://html5.gamemonetize.co" />

        {/* ③ 根 layout 的 hreflang 只覆盖首页；子页面通过 alternates.languages 各自声明 */}
        {locales &&
          locales.map((loc) => (
            <link
              key={loc}
              rel="alternate"
              hrefLang={loc}
              href={`${webUrl}${loc === "en" ? "" : `/${loc}`}/`}
            />
          ))}
        <link rel="alternate" hrefLang="x-default" href={webUrl} />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5130254389782226"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#80D893] bg-[url('/imgs/backgrounds/emeralds.svg')]">{children}</body>
    </html>
  );
}
