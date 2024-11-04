"use client";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "next-intl";
import styles from "./login.module.css";
import Link from "next/link";
import { BlinkBlur } from "react-loading-indicators";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/auth/login`,
        data,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        router.push(`/${locale}`);
      }
    } catch (error) {
      setErrorMessage("Invalid email or password");
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <p>Signup to manage your bookings effortlessly</p>
        <h3>Welcome to Booking Website</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.input}>
          <label htmlFor="email">Email</label>
          <input id="email" {...register("email")} type="email" />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.input}>
          <label htmlFor="password">Password:</label>
          <input id="password" {...register("password")} type="password" />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>

        <p className={styles.termsText}>
          <Link href={`/${locale}/forgetPassword`}> Forgot Password ?</Link>
        </p>

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          Login
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

export default Login;
