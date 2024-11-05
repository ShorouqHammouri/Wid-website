/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";
import HeaderLayout from "./HeaderLayout"; // Import the new client-side header component
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "TRAZLER",
  description: "Booking application",
};
export default async function LocaleLayout({
  children,
  params: { locale: locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Fetch messages server-side
  const messages = await getMessages(locale as any);
  const cookiez = await cookies();
  const token = await cookiez.get("jwt")?.value;

  // const token = process.env.NEXT_PUBLIC_TESTTOKEN;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={montserrat.className}>
        <NextIntlClientProvider messages={messages}>
          {/* Render the client-side header layout */}
          <HeaderLayout cookies={cookiez} token={token} locale={locale}>
            {children}
          </HeaderLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
