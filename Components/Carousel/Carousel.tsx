/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import styles from "./carousel.module.css";

type Props = {
  cards: any[];
  isFor: string;
};

const Carousel = (props: Props) => {
  const { cards, isFor } = props;

  const [isMounted, setIsMounted] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [perView, setPerView] = useState<number>(3);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: screenWidth <= 800 ? 1 : isFor === "suggest" ? 2 : 3,
      spacing: 15,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      const newPerView =
        window.innerWidth <= 800 ? 1 : isFor === "suggest" ? 2 : 3;
      setPerView(newPerView);
    };

    handleResize();
    setIsMounted(true);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isFor]);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update({
        slides: {
          perView,
          spacing: 15,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return null;
  }

  // Calculate the number of dots to display: cards.length - perView
  const dotsCount = Math.max(0, cards.length - perView) + 1;

  return (
    <div className={styles.carouselContainer}>
      <div ref={sliderRef} className={`${styles.keenSlider} keen-slider`}>
        {cards.map((card, index) => (
          <div key={index} className="keen-slider__slide">
            <div
              style={
                isFor === "suggest"
                  ? { backgroundColor: "#fff" }
                  : isFor === "review"
                  ? { minHeight: "60.516vh" }
                  : {}
              }
              className={`${styles.card} number-slide${index + 1}`}
            >
              {card}
            </div>
          </div>
        ))}
      </div>
      {dotsCount > 1 ? (
        <div className={styles.dots}>
          {Array.from(Array(dotsCount).keys()).map((_, idx) => (
            <div
              key={idx}
              className={`${styles.dot} ${
                currentSlide === idx ? styles.active : ""
              }`}
            ></div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Carousel;
