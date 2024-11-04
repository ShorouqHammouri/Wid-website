/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // This ensures that the component runs in the client environment

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";
import Link from "next/link";
import { useLocale } from "next-intl";
import { BlinkBlur } from "react-loading-indicators";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

const Register = () => {
  const locale = useLocale();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/auth/register`,
        data
      );

      if (response.status === 201) {
        router.push("/login");
      }
    } catch (error) {
      setErrorMessage("Failed to register. Please try again.");
      console.error("Error during registration:", error);
    }
  };

  // Prevent rendering on server
  if (!mounted) return null;

  return (
    <div>
      <div className={styles.header}>
        <p>Signup to manage your bookings effortlessly</p>
        <h3>Welcome to Booking Website</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.input}>
          <label htmlFor="firstName">First Name:</label>
          <input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <p style={{ color: "red" }}>{errors.firstName.message}</p>
          )}
        </div>

        <div className={styles.input}>
          <label htmlFor="lastName">Last Name:</label>
          <input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <p style={{ color: "red" }}>{errors.lastName.message}</p>
          )}
        </div>

        <div className={styles.input}>
          <label htmlFor="email">Email:</label>
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
          By creating an account, you agree to the{" "}
          <Link href={`/${locale}/terms`}> Terms of use</Link> and{" "}
          <Link href={`/${locale}/privacy`}> Privacy Policy</Link>.
        </p>
        <button className={styles.button} type="submit" disabled={isSubmitting}>
          Register
        </button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <p className={styles.loginText}>
          Have an account?{" "}
          <Link
            href={`/${locale}/login`}
            onWaiting={() => (
              <BlinkBlur
                color={"#47b3c5"}
                size="large"
                text="loading"
                textColor=""
              />
            )}
          >
            Login
          </Link>
          .
        </p>
      </form>
    </div>
  );
};

export default Register;
