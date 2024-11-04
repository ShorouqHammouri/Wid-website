import React from "react";
import styles from "./syggested.module.css";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { FaBed, FaBroom } from "react-icons/fa";
import { FaRestroom } from "react-icons/fa6";
const Carousel = dynamic(() => import("@/Components/Carousel/Carousel"), {
  ssr: false,
});

// Define the TypeScript type for the offer data structure
type ApartmentOffer = {
  id: number;
  name: string;
  nightlyPrice: number;
  ApartmentAddress: {
    District: {
      name: string;
      City: {
        name: string;
      };
    };
  };
  ApartmentDetails: {
    numberOfBedrooms: number;
    numberOfBeds: number;
    numberOfBathrooms: number;
    numberOfBedRooms: number;
    numberOfGuests: number | null;
  };
  ApartmentImage: string;
  avgRating: number;
  reviewCount: number;
};

async function fetchOffers(locale: "en" | "ar"): Promise<ApartmentOffer[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/home/most-visited-apartments?limit=8&page=1&locale=${locale}`
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
}

export default async function Suggested() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locale: "en" | "ar" | any = getLocale();

  const offers = await fetchOffers(await locale);

  // Render stars for rating
  // const renderStars = (rating: number) => {
  //   const stars = [];
  //   for (let i = 0; i < 5; i++) {
  //     stars.push(
  //       <span key={i} className={i < rating ? styles.filledStar : styles.star}>
  //         ★
  //       </span>
  //     );
  //   }
  //   return stars;
  // };
  const awaitLocale = await locale;
  // Render cards
  const cards = () => {
    return offers.map((item) => (
      <Link
        href={`${awaitLocale}/apartments/${item.id}`}
        key={item.id}
        className={styles.card}
      >
        <div className={styles.imageContainer}>
          <Image
            src={item.ApartmentImage}
            alt={item.name}
            width={1000}
            height={1000}
            className={styles.apartmentImage}
          />
          <button className={styles.likeButton}>❤</button>
        </div>
        <div className={styles.details}>
          <h3 className={styles.name}>{item.name}</h3>
          <p className={styles.address}>
            {item.ApartmentAddress.District.name},{" "}
            {item.ApartmentAddress.District.City.name}
          </p>

          <div className={styles.rating}>
            <div className={styles.supply}>
              <FaBed /> <span>{item.ApartmentDetails.numberOfBeds}</span>
            </div>
            <div className={styles.supply}>
              <FaBroom /> <span>{item.ApartmentDetails.numberOfBedRooms}</span>
            </div>
            <div className={styles.supply}>
              <FaRestroom />{" "}
              <span>{item.ApartmentDetails.numberOfBathrooms}</span>
            </div>
          </div>
        </div>
      </Link>
    ));
  };

  return (
    <>
      <Carousel isFor="suggest" cards={cards()} />
    </>
  );
}
