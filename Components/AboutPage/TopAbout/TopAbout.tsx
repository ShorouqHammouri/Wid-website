"use client";
import React, { useEffect, useState, useMemo } from "react";
import styles from "./topabout.module.css";
import ImageComp from "@/Components/ImageComp/ImageComp";
import sofa from "../../../public/AboutSofa.png";
import garden from "../../../public/AboutGarden.png";
import { useLocale } from "next-intl";

interface AboutData {
  aboutUsFirstHeader: string;
  aboutUsFirstDescription: string;
  aboutUsSecondHeader: string;
  aboutUsSecondDescription: string;
}

export default function TopAbout() {
  const locale = useLocale();
  const [about, setAbout] = useState<AboutData | null>(null);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth !== screenWidth) {
        setScreenWidth(currentWidth);
      }
    };

    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [screenWidth]);

  // Using useMemo to optimize isMobile computation
  const isMobile = useMemo(() => screenWidth <= 800, [screenWidth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/app-settings/about-us-content?locale=${locale}`
        );
        const data = await response.json();
        setAbout(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        console.log("finally");
      }
    };

    fetchData();
  }, [locale]);

  return (
    <>
      <section className={styles.topSection}>
        <div className={styles.imageContainer}>
          <ImageComp image={isMobile ? garden : sofa} alt="Sofa" />
        </div>
        <div className={styles.paragraph}>
          <div className={styles.reliable}>
            <h4>{about?.aboutUsFirstHeader}</h4>
            <p>{about?.aboutUsFirstDescription}</p>
          </div>
          <div className={styles.story}>
            <h4>{about?.aboutUsSecondHeader}</h4>
            <p>{about?.aboutUsSecondDescription}</p>
          </div>
        </div>
      </section>
    </>
  );
}
