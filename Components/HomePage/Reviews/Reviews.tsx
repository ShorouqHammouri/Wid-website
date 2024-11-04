/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { getLocale } from "next-intl/server";
import React from "react";
import styles from "./reviews.module.css";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import dynamic from "next/dynamic";
const Carousel = dynamic(() => import("@/Components/Carousel/Carousel"), {
  ssr: false,
});


export default async function Reviews() {
  const locale: "en" | "ar" | any = getLocale();
  const fetchData = async () => {
    const response = await axios.get(
      `${
        process.env.NEXT_PUBLIC_BACKENDAPI
      }/v1/home/apartments-reviews?limit=5&page=1&locale=${await locale}`
    );

    return response.data;
  };

  const data = await fetchData();

  const Card = () => {
    return data.map(async (item: any, index: number) => (
      <>
        <div key={index} className={styles.card}>
          <div key={index} className={styles.subCard}>
            <div className={styles.textSection}>
              <h4 className={styles.name}>{item.Apartment.ApartmentName}</h4>
              <p className={styles.review}>{item.review}</p>
              <div className={styles.starSection}>
                <div className={styles.starRating}>
                  {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                      <FaStar
                        key={starValue}
                        className={styles.star}
                        size={24}
                        color={starValue <= item.rating ? "#ffc107" : "#e4e5e9"}
                      />
                    );
                  })}
                </div>
              </div>
              <div className={styles.userSection}>
                <Image
                  width={500}
                  height={500}
                  placeholder="empty"
                  loading="lazy"
                  src={item.User.profilePicture}
                  alt="Apartment"
                  className={styles.image}
                />
                <div>
                  <p>
                    {item.User.lastName} {item.User.lastName}
                  </p>
                  <p className={styles.addressSection}>
                    {item.Apartment.ApartmentAddress.District.name},{" "}
                    {item.Apartment.ApartmentAddress.District.City.name}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.imgSection}>
              <Image
                width={500}
                height={500}
                placeholder="empty"
                loading="lazy"
                src={item.Apartment.ApartmentImage}
                alt="Apartment"
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </>
    ));
  };

  return (
    <>
      <Carousel isFor="review" cards={Card()} />
    </>
  );
}
