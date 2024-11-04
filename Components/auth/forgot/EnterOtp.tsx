"use client";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FaBackward } from "react-icons/fa";
import { useLocale } from "next-intl";
import styles from "./enter.module.css";
import { BlinkBlur } from "react-loading-indicators";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  token: Yup.string()
    .length(4, "token must be 6 digits")
    .required("token is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const Entertoken = () => {
  const locale = useLocale();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: { token: string }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/auth/verify-reset-token`,
        data
      );

      if (response.status === 200) {
        console.log("Password reset successful:", response.data);
        router.push(`/${locale}/resetPassword`);
      }
    } catch (error) {
      setErrorMessage(
        "Invalid token or failed to reset password. Please try again."
      );
      console.error("Error during token verification:", error);
    }
  };

  return (
    <div>
      <div className={styles.back}>
        <Link href={`/${locale}/login`}>
          <FaBackward /> Back to Login
        </Link>
      </div>
      <div className={styles.header}>
        <h3>Verify code</h3>
        <p>An authentication code has been sent to your email.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.input}>
          <label htmlFor="token">token</label>
          <input id="token" {...register("token")} type="text" />
          {errors.token && (
            <p style={{ color: "red" }}>{errors.token.message}</p>
          )}
        </div>

        <div className={styles.input}>
          <label htmlFor="newEmail">Email</label>
          <input id="newEmail" {...register("email")} type="email" />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.message}</p>
          )}
        </div>

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          Reset Password
        </button>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <p className={styles.loginText}>
          Don’t have an account?{" "}
          <Link
            href={`/${locale}/register`}
            onWaiting={() => (
              <BlinkBlur
                color={"#47b3c5"}
                size="large"
                text="loading"
                textColor=""
              />
            )}
          >
            Register
          </Link>
          .
        </p>
      </form>
    </div>
  );
};

export default Entertoken;
