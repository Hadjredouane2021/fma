import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LocaleAttributes } from "@/components/common/LocaleAttributes";
import { NavigationProgress } from "@/components/common/NavigationProgress";
import { SpinnerLogoProvider } from "@/components/common/SpinnerLogoProvider";
import { SiteThemeStyle } from "@/components/common/SiteThemeStyle";
import { getLayoutSiteSettings } from "@/lib/site-settings-cache";
import { getAnnouncementPost } from "@/lib/posts-cache";
import { NewsAnnouncementPopup } from "@/components/common/NewsAnnouncementPopup";
import type { Locale } from "@/types";

export const revalidate = 300;

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

  const [messages, layoutSettings, announcement] = await Promise.all([
    getMessages(),
    getLayoutSiteSettings(),
    getAnnouncementPost(),
  ]);
  const { footer: footerContent, menu: menuContent, logo: siteLogo, spinner: siteSpinner } = layoutSettings;

  return (
    <NextIntlClientProvider messages={messages}>
      <SpinnerLogoProvider imageUrl={siteSpinner.imageUrl}>
        <SiteThemeStyle />
        <LocaleAttributes locale={locale as Locale} />
        <NavigationProgress />
        <Header locale={locale as Locale} menuContent={menuContent} siteLogo={siteLogo} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} footerContent={footerContent} siteLogo={siteLogo} menuContent={menuContent} />
        <NewsAnnouncementPopup locale={locale as Locale} announcement={announcement} />
      </SpinnerLogoProvider>
    </NextIntlClientProvider>
  );
}
