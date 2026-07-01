import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return {
    title: {
      template: `%s | Plants vs Brainrots`,
      default: t("metadata.title") || "Plants vs Brainrots Unblocked - Play FREE Online Games",
    },
    description: t("metadata.description") || "Play Plants vs Brainrots unblocked + 600 free online games instantly in your browser. No download required. Action, puzzle, racing, sports games and more.",
    keywords: t("metadata.keywords") || "plants vs brainrots, plants vs brainrots unblocked, free online games, browser games, html5 games, play games online, no download games",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>{children}</ThemeProvider>
    </NextIntlClientProvider>
  );
}
