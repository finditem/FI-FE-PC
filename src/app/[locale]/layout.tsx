import ReactDOM from "react-dom";
import "../globals.css";
import localFont from "next/font/local";
import { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const pretendard = localFont({
  src: [
    {
      path: "../../../public/fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { getTranslations } = await import("next-intl/server");
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      absolute: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: locale === "en" ? "en_US" : "ko_KR",
      images: [
        {
          url: "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/9e619169-f_default-share.png",
          width: 1200,
          height: 630,
          alt: t("ogAlt"),
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      images: [
        "https://fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/9e619169-f_default-share.png",
      ],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  ReactDOM.preload("/icons/sprite.svg", { as: "image", type: "image/svg+xml" });

  return (
    <html lang={locale} className={pretendard.variable}>
      <body>
        <NextIntlClientProvider>
          <main className="w-full flex-1">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
