import styles from "./register.module.css";
import Image from "next/image";
import registerImage from "@/public/AboutSofa.png";
import Register from "@/Components/auth/register/Register";


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
