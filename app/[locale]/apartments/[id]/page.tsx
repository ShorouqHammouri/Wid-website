/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Button from "@/Components/Buttons/Button";
import axios from "axios";
import styles from "./apartmentDetails.module.css";
import { BiLocationPlus } from "react-icons/bi";
import { IoMdShare } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { getLocale, getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import { OrbitProgress } from "react-loading-indicators";
import { cookies } from "next/headers";
const ApiButton = dynamic(() => import("@/Components/Buttons/ApiButton"), {
  ssr: false,
});
const StarRating = dynamic(() => import("@/Components/StarRating/StarRating"), {
  ssr: false,
});
const ApartmentReviews = dynamic(
  () => import("@/Components/ApartmentReviews/ApartmentReviews"),
  {
    ssr: false,
    loading: () => (
      <OrbitProgress variant="dotted" dense color={"#47b3c5"} size="large" />
    ),
  }
);
const ImageSection = dynamic(
  () => import("@/Components/ImageElement/ImageSection"),
  {
    ssr: false,
    loading: () => (
      <OrbitProgress variant="dotted" dense color={"#47b3c5"} size="large" />
    ),
  }
);
const Amenities = dynamic(
  () => import("@/Components/amenitiesComp/Amenities"),
  {
    ssr: false,
    loading: () => (
      <OrbitProgress variant="dotted" dense color={"#47b3c5"} size="large" />
    ),
  }
);
const Reviews = dynamic(() => import("@/Components/reviews/Reviews"), {
  ssr: false,
  loading: () => (
    <OrbitProgress variant="dotted" dense color={"#47b3c5"} size="large" />
  ),
});
const ReviewModal = dynamic(
  () => import("@/Components/modal/reviewModal/ReviewModal"),
  {
    ssr: false,
  }
);

type Data = {
  id: number;
  title: string;
  data: {
    id: string;
    name: string;
    description: string;
    nightlyPrice: number;
    ApartmentAddress: {
      addressLine: string;
      City: { id: number; name: string };
      District: { id: number; name: string };
      longitude: number;
      latitude: number;
    };
    ApartmentImages: {
      id: string;
      imageUrl: string;
    }[];
    ApartmentDetails: {
      sizeArea: number;
      numberOfBedRooms: number;
      numberOfBeds: number;
      numberOfBathrooms: number;
      numberOfGuests: number | null;
      isFurnished: boolean;
      isPetsAllowed: boolean;
    };
    ApartmentAmenities: {
      hasAirConditioning: boolean;
      hasBalcony: boolean;
      hasCleaningProducts: boolean;
      hasClutery: boolean;
      hasCoffeeMaker: boolean;
      hasDishwasher: boolean;
      hasDryer: boolean;
      hasEVCharger: boolean;
      hasElevator: boolean;
      hasEssentials: boolean;
      hasFreeParking: boolean;
      hasFridge: boolean;
      hasHairDryer: boolean;
      hasHeating: boolean;
      hasIron: boolean;
      hasKitchen: boolean;
      hasOven: boolean;
      hasShampoo: boolean;
      hasTv: boolean;
      hasWashingMachine: boolean;
      hasWheelchairAccess: boolean;
      hasWifi: boolean;
    };
    avgRating: number;
    reviewCount: number;
    isWished: boolean;
  };
};

type History = [
  {
    Apartment: {
      id: string;
    };
  }
];

export default async function ApartmentPageId({
  params: { id },
  searchParams: { start_date, end_date, city, district },
}: any) {
  const t = getTranslations("Buttons");

  const locale: "en" | "ar" | any = getLocale();

  const cookiez = cookies();
  const token = cookiez.get("jwt")?.value;
  // const token = process.env.NEXT_PUBLIC_TESTTOKEN;
  // Fetch data (SSR)

  const fetchData = async (): Promise<Data | null> => {
    try {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKENDAPI
        }/v1/apartments/${id}?locale=${await locale}`,
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

  const data: Data | null = await fetchData();
  const fetchHistory = async (): Promise<Data | null> => {
    if (!token) return null;
    try {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKENDAPI
        }/v1/user/get-bookings-history?locale=${await locale}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  const history: History | any = await fetchHistory();

  const lon = data?.data.ApartmentAddress.longitude;
  const lat = data?.data.ApartmentAddress.latitude;

  return (
    <>
      {/* top section .... grid */}
      {/* content */}
      <div className={styles.cardActions}>
        {/* description */}
        <div className={styles.cardDesc}>
          {/* apartment name */}
          <div className={styles.name}>
            <p>{data?.data.name}</p>
          </div>
          {/* address */}
          <div className={styles.address}>
            <p>
              <span>
                <BiLocationPlus />
              </span>
              {`${data?.data.ApartmentAddress.addressLine}, ${data?.data.ApartmentAddress.City.name}, ${data?.data.ApartmentAddress.District.name}`}
            </p>
          </div>
          {/* rating */}
          <div className={styles.rating}>
            <StarRating rating={data?.data.avgRating} />
          </div>
          {/* ApartmentReviews */}
          <div className={styles.roomReviews}>
            <ApartmentReviews
              rate={data?.data.avgRating}
              reviewsNo={data?.data.reviewCount}
            />
          </div>
          {/* price/night */}
          <div className={styles.roomPrice}>
            <div className={styles.roomDetailsPrice}>
              <p>${`${data?.data.nightlyPrice}`}</p>
              <span>/night</span>
            </div>
          </div>
          {/* buttons */}
          <div className={styles.cardButtons}>
            <div className={styles.apiBtn}>
              <ApiButton
                icon={<CiHeart />}
                method={"POST"}
                endpoint={`/v1/wishlist/toggle-wish/${id}`}
                token={token}
                id={data?.data.id}
              />
            </div>
            <div className={styles.apiBtn}>
              <ApiButton
                icon={<IoMdShare />}
                method={"POST"}
                endpoint={`/v1/wishlist/toggle-wish/${id}`}
                token={token}
              />
            </div>
            <div className={styles.viewBtn}>
              <Button
                text={(await t)("bookNow")}
                onClicks={`${id}/payment?start_date=${start_date}&end_date=${end_date}&city=${city}&district=${district}`}
                type={undefined}
              />
            </div>
          </div>
          {/* images */}

          <div className={styles.galleryContainer}>
            <ImageSection images={data?.data?.ApartmentImages} />
          </div>
        </div>
      </div>
      {/* bottom section ....  */}

      <div className={styles.bottomSection}>
        <div className={styles.textContainer}>
          <h4>OVERVIEW</h4>
          <p>{data?.data.description}</p>
        </div>
        {/* edit */}
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <p className={styles.cardHeader}>
              {data?.data?.avgRating ?? "No rating available"}
            </p>
            <p className={styles.rateCardComp}>
              {data?.data?.avgRating
                ? (data.data.avgRating / 5) * 100 > 85
                  ? "Excellent"
                  : (data.data.avgRating / 5) * 100 > 65
                  ? "Very Good"
                  : "Good"
                : "No rating available"}
            </p>
            <p className={styles.reviewCardComp}>
              {data?.data?.reviewCount ?? "0"} reviews
            </p>
          </div>

          {/*  */}
          <div className={styles.card}>
            <p className={styles.cardHeader}>
              {data?.data.ApartmentDetails?.isPetsAllowed
                ? "Pets Allowded"
                : "Pets Not Allowded"}{" "}
            </p>
            <svg
              width="55"
              height="55"
              viewBox="0 0 55 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect width="55" height="55" fill="url(#pattern0_1216_2401)" />
              <defs>
                <pattern
                  id="pattern0_1216_2401"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlinkHref="#image0_1216_2401"
                    transform="scale(0.0192308)"
                  />
                </pattern>
                <image
                  id="image0_1216_2401"
                  width="52"
                  height="52"
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </div>
          {/*  */}
          <div className={styles.card}>
            <p className={styles.cardHeader}>
              {" "}
              {data?.data.ApartmentDetails?.numberOfBedRooms} Bedrooms
            </p>
            <svg
              width="55"
              height="55"
              viewBox="0 0 55 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect width="55" height="55" fill="url(#pattern0_1216_2398)" />
              <defs>
                <pattern
                  id="pattern0_1216_2398"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlinkHref="#image0_1216_2398"
                    transform="scale(0.0192308)"
                  />
                </pattern>
                <image
                  id="image0_1216_2398"
                  width="52"
                  height="52"
                  xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAR9SURBVHgB5VpJqx5FFD39veF7mmiixhjBIRoQHyoi4oQkasBhIYjDVpG4Fjf+jIDowpULxY26FVHMIgZBdOUQ/QEOEBFxQtSoSeec11Xp2/VudffrJHz9vRy4VHX1rep76t6qrqruAi0oy3I7k7spt1IuaFMNaeGUFxn9IrlfmvuFU/9XyreUj4qi+A0ZFLkbgcyzlO0tBuTKPONjPn1urjNy7YnY2yT1o6PvEwpkDgQyQ5Dr9dx1rpNKp12VyUOvktQ/yX0swsdNlJ3mOhc6feAZdqaQbXsph9IbOUL7KUuoSXzA3vgQMwSj5jEm96HunLvgEJo4FTX4r6AsBxGxjzF7qEP/R2XTlLKLtl6WKnkeuhoViYjv6Z2/MWPIBhL4g9ltpnjdzOsRktfUC3Hc/IfxQLbEzpZtW1MFj1CBevyUyI+zWUB2KdyyU33OQ7bSmAjJlhg9Qi9C0UMRSxgPZK+1Z+IppBCh5Q6dWUFkrG29Q866dUyEFjAg5ERoqUNnVljCgJATNhRyfD+sMLmRsgvVhNJ3oSloPXaM75kv0Y04KWTba/NQnLZbJ4WWVTnQvgpvlLOd+5m80bY1QNNDBRwPTZxKUpyiHoBZDwUyz1EuDW0tmjTmF4xMnHxMtYw5ENrMIY6huCTb8BjqerE+SrkGw+CtwrWseYbySqaOneVUt/e03Rly7MnLmTyYFL9P+Q7rN3DeHifmVyn7jP7tbHsHQ+9n57GLaHrmrK4U7kFzA3iURryFjeMTEriO6S2oSartdx3dQe+hviuFa9Ek9AWGQ3X3hrwI7c7oLaDpoV4hl85yOQ8p5CyhfzEcqrsNtaE7M3rWQ+4s1zA2vE8U0xfGIsodLH/NaVxhcRVq4s9T73EMg9q5HvU4e4JtXWnux2fcYGwTVqn3tZ3qC0NGx1WPoAqlp53G0ngtMPycoQsl1s+A3rvtTVRHW4dJ6ogK1zxEMg+g2q8Lx1HFqm3Ie1+dS/TtrKiznxyOk9SnE2YuQTX9ToP8QvndqTQ2yMZjqGzWuHpYXOShfaEwQucHT6Ea9FOMFz9QFFkr4Vq23ilCq6gXlAqvd+i6zzAHoEdOMHnSFN2msbEHtduUHsX8QB0/NbInLsdPL0nonb8wJ5Ct9FLDfhEa8zjpg4b9m5LQMuYb50fItX10GjtaCc0jGkOm8xRlDrBpQ64xKWzKkBPmkVjri3VTEGqconBtpN2qt2McI7S41vbhJMLLVQTst367U5WSJdU1C3Ye9yZlgH9+1xeerWuETiaKds+e+3PE6rZ50jvbLjN6ZUu9MtNWWq+Uy46Ym7mDkHhklEsnznWRPLhw9FPdScsz4eikbX8lD+1m5gXKvWieh31D+QnjhI4HbjbXsvM9ysv2GOtF1GfVKj84679HcqCtDzGRvTHcDtHWg8rYg8YtlB0hHz+pjBWyzf5FclHMWEIXoyYUK40Vss3auiVmLKGtidIKxgsR0jiKIed6SId29tz4T4wXsi3+5yNS6/9F0qdAyudlhdcxctDGl4Kth8NMvYZThblBiS056r8AAAAASUVORK5CYII="
                />
              </defs>
            </svg>
          </div>
          {/*  */}
          <div className={styles.card}>
            <p className={styles.cardHeader}>
              {" "}
              {data?.data.ApartmentDetails?.numberOfBathrooms} Bathrooms
            </p>
            <svg
              width="55"
              height="55"
              viewBox="0 0 55 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect width="55" height="55" fill="url(#pattern0_1216_2404)" />
              <defs>
                <pattern
                  id="pattern0_1216_2404"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlinkHref="#image0_1216_2404"
                    transform="scale(0.0208333)"
                  />
                </pattern>
                <image
                  id="image0_1216_2404"
                  width="48"
                  height="48"
                  xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQpSURBVHgB1Vk7axVBGD17Y6FoxAeITxAkAUVQUWJhFaIgVqJFJFoopPAHWKjgX7CwEUnEQpCIiBIb0ygIvgjxATFNUAJqSCx8kgQsXM/n7uTOzs7s7F7vxvXAl9n9Mo9zZr6ZnZkboCDCMFzMZBdtM20tbYW4adO0KdrLIAgmsEAIimQm+a1MDtFWIiJt1hXG6QvaAwr5ipKRWwDJdzHpUq85ygv5Por4ghKRSwDJ72dyAPUedgkIDZ+Qv1KmiJovA8lLuByktcQmZRZpzyo1n8VW07pRIhblyNODpFDp4V+0d7Qh2iSiObEekdBVWj4ZkXZ2wnaOwihKQKYANixk2pAOmyESuq9lnaNNMr+I6kUkRoWSlOuklSLAF0I7kAwVsWGD/Dzo/8ykn/bTKCOjsAQlwCegXSOh7HlWgVjEKNLC21ACfHNgWUwi0AiOw48PSM+bpSgBPgFqxQlRDM9orw3fHEpAHgHepdYER2mWySwWAD4BMvQtqDB8AtRE1JfRSqHoCFRORJ458F+HkJrE1Q4hfiVlje6IffoWoBVGCBGdnjptYvP68mKGNsHV7lNAQnv5ch7JvY65bVZ+ILll9hFw1QWk91fmVtx8N/2SXhIBV/mwJqPyv0WWCFfevJiREFrn+GcIe8/Y8vjgy2eOqu3QZIuGVhFQgz8kigyxrTEbGVebeUfhT3l1stKdP2hvUXw49cZt8a2egexedvW4vG9BtMGc95sCBDK7z6CC4Hy9yGSneoVDQOHN2wLC/LCGag4I1DAtR3WR2h3Li2x79dNTK6oLOWvrp7w5JUB3bmKsVU5EzGkj6guP2LQQf4X0HU87qofdSN87TcmfcST3/fJ8GtVDJ5KdLCPxSB7uxU59aDo4ZHtQEZCLxP5hRBxrWjpS45ovH64RpK8Gz1ZhLsQcriF9fTlC7pNqSbqM5N2n2DbaOfx7CAeZvCY/4RytqVQyzOQh6sOjwukIe+AubQMWGNIm7TofjyJJXLgNxpzrmzFmlg/YIM1GVi6q7tBus+BHlEtcQuYU7SSib5K5JxMuJxSPwCgsYXMD0dfYddgYo0nh7w4Oro1cHsjhaqOio9WhIG32kPwYLP+EJuIm6upVZXlPar5zhI2YzWf6hXy3Tt5WQImQXriFem8A7t5s9PRWpJyETS/Jv7FVYkU8J+SuX99au0Yi69jo+xlKL2/W/43WR+sneWvIeo+DFLIpFnHMlQX2A4ntHcgOQx0DtAsu4gren5hYwXuKkNvmHqNhaeCxrzj8x1TBPqQ76KmPvCDPb2QKNS2Vhp+wgQE0AewgEXMc9mNmJvIKUJs8vdJmntwCJDtI+bwoKsD0NQsN119EgPqlppElM0/9LUiGT9MFqNgPNF+zoI9AiGRIZaKoANPXLOj1F/owNiIga5vQKFT9ru+JE78BAno66ttrDt4AAAAASUVORK5CYII="
                />
              </defs>
            </svg>
          </div>
        </div>
        {/* edit */}
        {/* location */}
        <div className={styles.locationContainer}>
          <div className={styles.locationHeader}>
            <h4>LOCATION</h4>
            <button className={styles.gmapButton}>view on google maps</button>
          </div>
          <div className={styles.locationMap}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon}%2C${lat}%2C${lon}%2C${lat}&layer=mapnik&marker=${lat}%2C${lon}`}
              allowFullScreen={true}
              aria-hidden="false"
            ></iframe>
          </div>
        </div>
        <div className={styles.amenitiesContainer}>
          <h4>AMENITIES</h4>
          <Amenities amenities={data?.data.ApartmentAmenities} />
        </div>
      </div>

      {/* review */}
      <div className={styles.reviewContainer}>
        <div className={styles.reviewHeader}>
          <h4>REVIEWS</h4>
          {(history &&
            (await history?.filter(
              (item: any) => item.Apartment?.id === data?.data.id
            ).length)) > 0 ? (
            <ReviewModal
              method="POST"
              endpoint=""
              data=""
              text="Add review"
              width="100%"
            />
          ) : null}
        </div>
        <Reviews id={id} />
      </div>
    </>
  );
}
