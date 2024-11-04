/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLocale } from "next-intl/server";
import Image from "next/image";
import React from "react";
import styles from "./topRated.module.css";
import dynamic from "next/dynamic";
const Button = dynamic(() => import("@/Components/Buttons/Button"), {
  ssr: false,
});
const Carousel = dynamic(() => import("@/Components/Carousel/Carousel"), {
  ssr: false,
});

export default async function TopRated() {
  const locale: "en" | "ar" | any = getLocale();
  const fetchData = async () => {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKENDAPI
      }/v1/home/top-rated-apartments?limit=10&page=1&locale=${await locale}`
    );

    return response.json();
  };

  const data = await fetchData();

  const Card = () => {
    return data.map(
      async (
        item: { ApartmentImage: string; name: string; id: string },
        index: number
      ) => (
        <div key={index} className={styles.card}>
          <Image
            width={1000}
            height={1000}
            src={item.ApartmentImage}
            alt="Apartment"
            className={styles.image}
          />
          <div className={styles.bookParagraph}>
            <p>
              {item.name.length <= 26
                ? `${item.name}`
                : `${item.name.slice(0, 25)}...`}
            </p>
          </div>
          <div className={styles.bookButton}>
            <Button
              text="Book Now"
              onClicks={`${await locale}/apartments/${item.id}`}
              type={undefined}
            />
          </div>
        </div>
      )
    );
  };

  return (
    <>
      <Carousel isFor="toprated" cards={Card()} />
    </>
  );
}
