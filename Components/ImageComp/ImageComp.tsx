import Image from "next/image";
import styles from "./image.module.css";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import React from "react";

interface Props {
  image: string | StaticImport | unknown;
  alt: string;
}
export default function ImageComp(props: Props) {
  return (
    <>
      <Image
        src={props.image as string | StaticImport}
        alt={props.alt}
        className={styles.image}
        quality={100}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
        width={100}
        height={100}
      />
    </>
  );
}
