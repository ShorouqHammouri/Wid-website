import { BlinkBlur } from "react-loading-indicators";
import styles from "./register.module.css";
import dynamic from "next/dynamic";
import Image from "next/image";
import registerImage from "@/public/AboutSofa.png";

const Register = dynamic(() =>
  import("@/Components/auth/register/Register", {
    ssr: false,
    loading: () => (
      <BlinkBlur color={"#47b3c5"} size="large" text="loading" textColor="" />
    ),
  })
);

const registerPage = () => {
  return (
    <>
      <section className={styles.registerPage}>
        <div className={styles.form}>
          <Register />
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
};

export default registerPage;
