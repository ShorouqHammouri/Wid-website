"use client";
import React, { lazy } from "react";
import Image from "next/image";
import styles from "./about.module.css";
import { useLocale, useTranslations } from "next-intl";
import aboutImage from "@/public/HomePage/homePageMulti.png";
const Button = lazy(() => import("@/Components/Buttons/Button"));

export default function AboutHome() {
  const locale = useLocale();

  const t = useTranslations("HomePage");
  return (
    <>
      {/* About Us Section */}
      <div className={styles.AboutUs}>
        <p className={styles.Textheader}>{t("title")}</p>
        <p className={styles.AboutUsTextbody}>{t("about")}</p>
        <div className={styles.AboutUsBtn}>
          <Button
            text={t("title")}
            onClicks={`${locale}/about`}
            type="button"
          />
        </div>
        <div className={styles.AboutUsImg}>
          <Image
            width={1000}
            height={1000}
            src={aboutImage}
            alt="about us"
            loading="eager"
            placeholder="blur"
          />
        </div>
      </div>
    </>
  );
}
