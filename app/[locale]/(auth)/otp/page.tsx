import EnterOTP from "@/Components/auth/forgot/EnterOtp";
import React from "react";
import styles from "./otp.module.css";
import Image from "next/image";
import registerImage from "@/public/AboutSofa.png";

export default function OtpPage() {
  return (
    <>
      <section className={styles.registerPage}>
        <div className={styles.form}>
          <EnterOTP />
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
