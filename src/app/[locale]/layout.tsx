import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LocaleAttributes } from "@/components/common/LocaleAttributes";
import { NavigationProgress } from "@/components/common/NavigationProgress";
import { SpinnerLogoProvider } from "@/components/common/SpinnerLogoProvider";
import { getFooterContent } from "@/lib/footer-site-public";
import { getMenuContent } from "@/lib/menu-site-public";
import { getSiteLogo } from "@/lib/site-logo";
import { getSiteSpinner } from "@/lib/site-spinner";
import type { Locale } from "@/types";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "fr" | "en" | "ar")) notFound();

  const [messages, footerContent, menuContent, siteLogo, siteSpinner] = await Promise.all([
    getMessages(),
    getFooterContent(),
    getMenuContent(),
    getSiteLogo(),
    getSiteSpinner(),
  ]);

  return (
    <NextIntlClientProvider messages={messages}>
      <SpinnerLogoProvider imageUrl={siteSpinner.imageUrl}>
        <LocaleAttributes locale={locale as Locale} />
        <NavigationProgress />
        <Header locale={locale as Locale} menuContent={menuContent} siteLogo={siteLogo} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} footerContent={footerContent} siteLogo={siteLogo} menuContent={menuContent} />
      </SpinnerLogoProvider>
    </NextIntlClientProvider>
  );
}
