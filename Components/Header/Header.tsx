/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import logo from "../../public/LOGO.png";
import Link from "next/link";
import styles from "./header.module.css";
import Button from "../Buttons/Button";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import ResponsiveHeader from "@/Components/Header/responsive/ResponsiveHeader";
import axios from "axios";
import Image from "next/image";
import ProfileBtn from "../Buttons/profileBtn/ProfileBtn";
import ar from "./ar.svg";
import en from "./en.svg";

export default function Header({
  cookies,
  token,
}: {
  cookies: string | any;
  token: string | any;
}) {
  const t = useTranslations("Header");

  const pathname = usePathname();
  const searchParams = useSearchParams().toString();
  const locale = useLocale();

  const [isMounted, setIsMounted] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [response, setResponse] = useState<{ firstName: string }>();
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth <= 800;

  useEffect(() => {
    if (token) {
      // const token = cookies;

      axios
        .get(`${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/user/get-profileInfo`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setIsLogged(true);
            setResponse(response.data);
          }
        })
        .catch((err) => console.log(err));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navBar1 = [
    {
      name: t("HOME"),
      href: `/${locale}`,
    },
    {
      name: t("ABOUT"),
      href: `/${locale}/about`,
    },
    {
      name: t("APARTMENTS"),
      href: `/${locale}/apartments`,
    },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {!isMobile ? (
        <nav className={styles.navbar}>
          <ul className={styles.navbarList}>
            <div className={styles.navbardiv}>
              {navBar1.map((el, ind) => (
                <li key={ind} className={styles.navbarLi}>
                  <Link href={`${el.href}`} prefetch={true}>
                    {el.name}
                  </Link>
                </li>
              ))}
            </div>
            <li
              className={`${styles.navbarLogo} ${styles.navbarLi}`}
              style={{ width: "40vw", height: "90px" }}
            >
              <Link href={`/${locale}`} prefetch={true}>
                <Image
                  width={500}
                  height={500}
                  loading="eager"
                  src={logo}
                  alt="logo"
                  placeholder="blur"
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
            </li>
            <div className={styles.navbardiv}>
              <li className={styles.navbarLi}>
                <Link
                  href={
                    locale === "en"
                      ? `/ar/${pathname.slice(4)}?${
                          searchParams ? searchParams : ""
                        }`
                      : `/en/${pathname.slice(4)}?${
                          searchParams ? searchParams : ""
                        }`
                  }
                  prefetch={true}
                >
                  <div className={styles.languageSwitch}>
                    {locale === "en" ? (
                      <Image
                        src={en}
                        alt="ar"
                        width={100}
                        height={100}
                        style={{ width: "30%", height: "auto" }}
                      />
                    ) : (
                      <Image
                        src={ar}
                        alt="ar"
                        width={100}
                        height={100}
                        style={{ width: "30%", height: "auto" }}
                      />
                    )}
                  </div>
                </Link>
              </li>

              <li className={styles.navbarLi}>
                <Link href={`/${locale}/contact`} prefetch={true}>
                  {t("CONTACT")}
                </Link>
              </li>
              <li className={styles.navbarLi}>
                {!isLogged ? (
                  <Link href={`/${locale}/register`} prefetch={true}>
                    {t("SIGNUP")}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/profile?history=${"History"}`}
                    prefetch={true}
                  >
                    {t("HISTORY")}
                  </Link>
                )}
              </li>
              <li className={`${styles.btn}`}>
                {!isLogged ? (
                  <Button
                    onClicks={`/${locale}/login`}
                    type={undefined}
                    text={t("LOGIN")}
                  />
                ) : (
                  <ProfileBtn
                    onClicks={`/${locale}/profile`}
                    type={undefined}
                    text={response?.firstName}
                    response={response}
                    token={token}
                    cookies={cookies}
                  />
                )}
              </li>
            </div>
          </ul>
        </nav>
      ) : (
        <div>
          <ResponsiveHeader
            pathname={pathname}
            searchParams={searchParams}
            locale={locale}
            cookies={cookies}
            token={token}
            isLogged={isLogged}
            t={t}
            navBar1={navBar1}
            response={response}
          />
        </div>
      )}
    </>
  );
}
