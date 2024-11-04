/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FaStar } from "react-icons/fa";
import styles from "./StarRating.module.css"; // Import CSS module
import React, { useEffect, useState } from "react";

interface StarRatingProps {
  rating: number | any;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      // Only update the state if the width is different
      if (currentWidth !== screenWidth) {
        setScreenWidth(currentWidth);
      }
    };

    // Set the initial screen width on mount
    setScreenWidth(window.innerWidth);

    // Add the resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [screenWidth]);
  const isMobile = screenWidth <= 800;
  return (
    <>
      <div className={styles.starSection}>
        <div className={styles.starRating}>
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <FaStar
                key={starValue}
                className={styles.star}
                size={24}
                color={starValue <= rating ? "#ffc107" : "#e4e5e9"}
              />
            );
          })}
        </div>
        <div className={styles.value}>
          <p>{isMobile ? "" : rating?.toFixed(1)}</p>
        </div>
      </div>
    </>
  );
};

export default StarRating;
