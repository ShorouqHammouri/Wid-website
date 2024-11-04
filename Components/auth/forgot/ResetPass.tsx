"use client";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./reset.module.css";
import { useLocale } from "next-intl";
import Link from "next/link";
import { FaBackward } from "react-icons/fa";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  token: Yup.string()
    .length(4, "token must be 4 digits")
    .required("token is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ResetPass = () => {
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

  const onSubmit = async (data: {
    token: string;
    password: string;
    email: string;
  }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/auth/reset-password`,
        {
          token: data.token,
          password: data.password,
        }
      );

      if (response.status === 200) {
        console.log("Password reset successful:", response.data);
        router.push(`/${locale}/login`);
      }
    } catch (error) {
      setErrorMessage(
        "Invalid token or failed to reset password. Please try again."
      );
      console.error("Error during password reset:", error);
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
        <h3>Got your OTP</h3>
        <p>Don’t worry, this is the final step</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.input}>
          <label htmlFor="token">OTP</label>
          <input id="token" {...register("token")} type="text" />
          {errors.token && (
            <p style={{ color: "red" }}>{errors.token.message}</p>
          )}
        </div>

        <div className={styles.input}>
          <label htmlFor="password">New Password</label>
          <input id="password" {...register("password")} type="password" />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>

        <div className={styles.input}>
          <label htmlFor="email">Confirm Email</label>
          <input id="email" {...register("email")} type="email" />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.message}</p>
          )}
        </div>

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          Reset Password
        </button>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default ResetPass;
