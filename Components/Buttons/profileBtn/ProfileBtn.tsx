/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./profileBtn.module.css";
import Link from "next/link";
import { useLocale } from "next-intl";
import Image from "next/image";

interface Props {
  onClicks: string;
  type: "submit" | "button" | "reset" | undefined;
  text: string | any;
  response: any;
  cookies: any;
  token: string;
}

export default function ProfileBtn(props: Props) {
  const profile = props.response;
  const cookies = props.cookies;

  const locale = useLocale();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = async () => {
    // console.log(cookies);
    
    cookies.delete("jwt");
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div onClick={handleClick} className={styles.button}>
        <Image
          src={profile.profilePicture}
          alt="profile picture"
          width={40}
          height={40}
          loading="lazy"
          placeholder="empty"
        />
        <p>{profile.firstName}</p>
      </div>
      {isOpen && (
        <div ref={profileRef} className={styles.dropdown}>
          <ul>
            <li>
              <Link
                onClick={() => setIsOpen(false)}
                href={`/${locale}/profile`}
              >
                My account
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setIsOpen(false)}
                href={`/${locale}/profile?history=History`}
              >
                Payments
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                href={`/${locale}`}
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
