import React from "react";
import styles from "./apartmentReviews.module.css";

type Props = {
  rate?: number;
  reviewsNo?: number; 
};

export default function ApartmentReviews({ rate, reviewsNo }: Props) {
  // Handle cases where rate or reviewsNo might be undefined
  const rating = rate ?? 0; 
  const totalReviews = reviewsNo ?? 0; 

  return (
    <>
      <div className={styles.roomRate}>
        <p>{rating.toFixed(1)}</p>
      </div>
      <div className={styles.roomRateDetail}>
        <p>
          <span className={styles.roomRateEVGP}>
            {(rating / 5) * 100 > 85
              ? "Excellent"
              : (rating / 5) * 100 > 65
              ? "Very Good"
              : "Good"}
          </span>
          <span className={styles.roomRateReview}>
            {`  ${totalReviews} reviews`}
          </span>
        </p>
      </div>
    </>
  );
}
