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
      template: `%s | DuckMath`,
      default: t("metadata.title") || "DuckMath - Free Online Games",
    },
    description: t("metadata.description") || "Play 600+ free online games instantly in your browser. No download required.",
    keywords: t("metadata.keywords") || "free online games, browser games, html5 games, unblocked games",
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
