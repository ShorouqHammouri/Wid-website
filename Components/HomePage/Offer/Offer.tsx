import axios from "axios";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";
import styles from "./offer.module.css";
import Link from "next/link";

type Offers = {
  title: string;
  description: string;
};
export default async function Offer() {
  const t = getTranslations("Buttons");
  const locale: "en" | "ar" | unknown = getLocale();
  const fetchData = async (): Promise<Offers | null> => {
    try {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKENDAPI
        }/v1/home/offer-content?locale=${await locale}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return res?.data || null;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const offer: Offers | null = await fetchData();

  return (
    <>
      <section dir="ltr" className={styles.imageOverlay}>
        <div className={styles.contentBox}>
          <p className={styles.offerTitle}>{offer?.title}</p>
          <p className={styles.offerDesc}>{offer?.description}</p>
          <Link
            href={`/${await locale}/apartments`}
            prefetch={true}
            className={styles.offerBtn}
          >
            {(await t)("bookNow")}
          </Link>
        </div>
      </section>
    </>
  );
}
