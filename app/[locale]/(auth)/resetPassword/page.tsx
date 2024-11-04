import ResetPass from "@/Components/auth/forgot/ResetPass";
import React from "react";
import styles from "./reset.module.css";
import Image from "next/image";
import registerImage from "@/public/AboutSofa.png";


export default function page() {
  return (
    <>
    <section className={styles.registerPage}>
        <div className={styles.form}>
          
        <ResetPass />
        </div>
        <div className={styles.formImage}>
          <Image
            src={registerImage}
            width={1000}
            height={1000}
            alt="register image"
            className={styles.image}
          />
        </div>
      </section>
    </>
  );
}
