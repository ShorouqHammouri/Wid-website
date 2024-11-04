/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import styles from "./imageSection.module.css";
import Image, { StaticImageData } from "next/image";
interface Props {
  images:
    | {
        id: string;
        imageUrl: string | unknown | any;
      }[]
    | any;
}
interface Image {
  imageUrl: StaticImageData;
}

export default function ImageSection(props: Props) {
  const images: Image[] = props.images || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mainImage, setMainImage] = useState<StaticImageData | any>(
    images[0]?.imageUrl
  );

  const handleImageClick = (img: React.SetStateAction<StaticImageData>) => {
    setMainImage(img);
  };
  return (
    <>
      {/* Main large image */}
      {images.length <= 1 ? (
        <div className={styles.mainSingleImage}>
          <Image
            width={500}
            height={500}
            src={mainImage}
            alt="Main"
            loading="eager"
            placeholder="empty"
          />
        </div>
      ) : (
        <>
          <div className={styles.gallerySubContainer}>
            <div className={styles.mainImage}>
              <Image
                width={500}
                height={500}
                loading="eager"
                placeholder="empty"
                src={mainImage}
                alt="Main"
              />
            </div>
            {/* Small images */}
            <div className={styles.smallImages}>
              {images
                .filter((imgSelected) => imgSelected !== mainImage)
                .map((img, index) => (
                  <div
                    className={styles.smallImage}
                    key={index}
                    onClick={() => {
                      handleImageClick(img.imageUrl);
                    }}
                  >
                    <Image
                      width={500}
                      height={500}
                      loading="eager"
                      placeholder="empty"
                      src={img.imageUrl}
                      alt={`Small ${index + 2}`}
                    />
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
