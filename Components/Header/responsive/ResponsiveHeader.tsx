/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./responsiveHeader.module.css";
import Link from "next/link";
import Button from "@/Components/Buttons/Button";
import ar from "../ar.svg";
import en from "../en.svg";
import Image from "next/image";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResponsiveHeader = ({
  pathname,
  // cookies,
  searchParams,
  locale,
  isLogged,
  t,
  navBar1,
  response,
}:
  | {
      cookies: string | any;
      pathname: string;
      searchParams: string;
      locale: string;
      isLogged: boolean;
      t: any;
      navBar1: {
        name: string;
        href: string;
      }[];
      response: {
        firstName: string | any;
      };
    }
  | any) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutsideMenu = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div ref={menuRef}>
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          style={isOpen ? { color: "black" } : { color: "#fff" }}
        >
          ☰
        </button>
        <div className={`${styles.menuContainer} ${isOpen ? styles.open : ""}`}>
          <div className={`${styles.menu}`}>
            <ul>
              <li>
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
                  onClick={() => setIsOpen(false)}
                  prefetch={true}
                >
                  <div className={styles.languageSwitch}>
                    {locale === "en" ? (
                      <Image
                        src={en}
                        alt="ar"
                        width={100}
                        height={100}
                        style={{ width: "10%", height: "auto" }}
                      />
                    ) : (
                      <Image
                        src={ar}
                        alt="ar"
                        width={100}
                        height={100}
                        style={{ width: "10%", height: "auto" }}
                      />
                    )}
                  </div>
                </Link>{" "}
              </li>
              <li>
                {navBar1.map(
                  (
                    el: { href: string; name: string },
                    ind: React.Key | null | undefined
                  ) => (
                    <li key={ind}>
                      <Link
                        href={`${el.href}`}
                        prefetch={true}
                        onClick={() => setIsOpen(false)}
                      >
                        {el.name}
                      </Link>
                    </li>
                  )
                )}
              </li>
              <li>
                {!isLogged ? (
                  <Link
                    href={`/${locale}/register`}
                    prefetch={true}
                    onClick={() => setIsOpen(false)}
                  >
                    {t("SIGNUP")}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/history`}
                    prefetch={true}
                    onClick={() => setIsOpen(false)}
                  >
                    {t("HISTORY")}
                  </Link>
                )}
              </li>
              <li>
                {!isLogged ? (
                  <Button
                    onClicks={`/${locale}/login`}
                    type={undefined}
                    text={t("LOGIN")}
                  />
                ) : (
                  <Button
                    onClicks={`/${locale}/profile`}
                    type={undefined}
                    text={response?.firstName}
                  />
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveHeader;
