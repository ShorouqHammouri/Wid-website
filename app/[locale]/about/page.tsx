import React from "react";
import dynamic from "next/dynamic"; // Import dynamic for lazy loading
import styles from "./about.module.css";

// Dynamically import the components
const TopAbout = dynamic(
  () => import("@/Components/AboutPage/TopAbout/TopAbout"),
  { ssr: false }
);
const MiddleAbout = dynamic(
  () => import("@/Components/AboutPage/MiddleAbout/MiddleAbout"),
  { ssr: false }
);
const Reviews = dynamic(() => import("@/Components/HomePage/Reviews/Reviews"), {
  ssr: false,
});

export default async function aboutPage() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.aboutSection}>
          <TopAbout />
        </div>
        <div className={styles.aboutSection}>
          <MiddleAbout />
        </div>
        <div className={styles.reviews}>
          <div className={styles.reviewsHeader}>
            <p className={styles.Textheader}>Reviews</p>
            <p className={styles.TextBody}>
              Browse our top-rated apartments, highly praised by guests for
              exceptional comfort and service.
            </p>
          </div>
          <div className={styles.reviewCarousel}>
            <Reviews />
          </div>
        </div>
      </main>
    </>
  );
}
