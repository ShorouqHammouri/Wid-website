import ForgetPassword from "@/Components/auth/forgot/ForgetPassword";
import React from "react";
import styles from "./forget.module.css"
import Image from "next/image";
import registerImage from "@/public/AboutSofa.png";

export default function ForgetPage() {
  return (
    <>
    <section className={styles.registerPage}>
        <div className={styles.form}>
        <ForgetPassword />
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
