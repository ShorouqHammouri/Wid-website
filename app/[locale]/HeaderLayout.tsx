/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { usePathname } from "next/navigation";
import Header from "@/Components/Header/Header";
import MobileAppFooter from "@/Components/Footer/Footer";


export default function HeaderLayout({
  children,
  locale,
  token,
  cookies,
}: {
  children: React.ReactNode;
  locale: string;
  token: string | any;
  cookies: string | any;
}) {
  const pathname = usePathname();

  const headerRoutes = [
    `/${locale}/login`,
    `/${locale}/register`,
    `/${locale}/forgetPassword`,
    `/${locale}/otp`,
    `/${locale}/resetPassword`,
  ];

  return (
    <>
      {!headerRoutes.includes(pathname) && (
        <header>
          <Header cookies={cookies} token={token} />
        </header>
      )}
      {children}
      {!headerRoutes.includes(pathname) && (
        <footer>
          <MobileAppFooter />
        </footer>
      )}
    </>
  );
}
