import Login from "@/Components/auth/login/Login";
import React from "react";
import Image from "next/image";
import registerImage from "@/public/AboutSofa.png";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <>
      <section className={styles.registerPage}>
        <div className={styles.form}>
          <Login />
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
