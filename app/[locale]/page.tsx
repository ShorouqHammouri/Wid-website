import React from "react";
import styles from "./page.module.css";
import { getLocale, getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import Image from "next/image";
import topHome from "@/public/HomePage/bbok.png";
import { OrbitProgress } from "react-loading-indicators";

const AboutHome = dynamic(
  () => import("@/Components/HomePage/About/AboutHome"),
  {
    ssr: false,
    loading: () => (
      <OrbitProgress style={{ margin: "auto" }} variant="dotted" dense color={"#47b3c5"} size="large" />
    ),
  }
);

const Offer = dynamic(() => import("@/Components/HomePage/Offer/Offer"), {
  ssr: false,
  loading: () => (
    <OrbitProgress style={{ margin: "auto" }} variant="dotted" dense color={"#47b3c5"} size="large" />
  ),
});
const ApartmentsPage = dynamic(
  () => import("@/Components/searchPage/ApartmentsPage"),
  {
    ssr: true,
    loading: () => (
      <OrbitProgress style={{ margin: "auto" }} variant="dotted" dense color={"#47b3c5"} size="large" />
    ),
  }
);
const TopRated = dynamic(
  () => import("@/Components/HomePage/TopRated/TopRated"),
  {
    ssr: true,
    loading: () => (
      <OrbitProgress style={{ margin: "auto" }} variant="dotted" dense color={"#47b3c5"} size="large" />
    ),
  }
);
const Suggested = dynamic(
  () => import("@/Components/HomePage/SuggestTental/Suggested"),
  {
    ssr: true,
    loading: () => (
      <OrbitProgress style={{ margin: "auto" }} variant="dotted" dense color={"#47b3c5"} size="large" />
    ),
  }
);
const Reviews = dynamic(() => import("@/Components/HomePage/Reviews/Reviews"), {
  ssr: true,
  loading: () => (
    <OrbitProgress style={{ margin: "auto" }} variant="dotted" dense color={"#47b3c5"} size="large" />
  ),
});

export default async function HomePage() {
  // Fetch translations and locale once, outside the render logic
  const t = await getTranslations("HomePage");
  const locale = await getLocale();

  return (
    <>
      {/* Optimized Image for the Home Page Header */}
      <Image
        src={topHome}
        width={1000}
        height={1000}
        alt="home"
        loading="eager"
        placeholder="blur"
        style={{
          width: "100vw",
          height: "auto",
          objectFit: "cover",
        }}
      />

      <section className={`${styles.homePage}`}>
        <ApartmentsPage />
        <main className={styles.main}>
          {/* about */}
          <AboutHome />

          {/* Top Rated Section */}
          <div className={styles.topRated}>
            <div className={styles.topRatedHeader}>
              <p className={styles.Textheader}>{t("topRatedTitle")}</p>
              <p className={styles.TextBody}>
                Browse our top-rated apartments, highly praised by guests for
                exceptional comfort and service.
              </p>
            </div>
            <div className={styles.topRatedCarousel}>
              <TopRated />
            </div>
          </div>

          {/* Offers Section */}
          <div
            style={{
              width: "100vw",
              marginBottom: "10vh",
              marginTop: "10vh",
              minHeight: "auto",
            }}
            className={locale === "ar" ? "rtl" : "ltr"}
          >
            <Offer />
          </div>

          {/* Suggested Rentals Section */}
          <div className={styles.suggested}>
            <div className={styles.suggestedHeader}>
              <p className={styles.Textheader}>{t("suggestedTitle")}</p>
              <p className={styles.TextBody}>
                Browse our top-rated apartments, highly praised by guests for
                exceptional comfort and service.
              </p>
            </div>
            <div className={styles.suggestedCarousel}>
              <Suggested />
            </div>
          </div>

          {/* Reviews Section */}
          <div className={styles.reviews}>
            <div className={styles.reviewsHeader}>
              <p className={styles.Textheader}>{t("reviewsTitle")}</p>
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
      </section>
    </>
  );
}
