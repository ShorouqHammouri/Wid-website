/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import styles from "./apiButton.module.css";
import { useLocale } from "next-intl";

interface ApiButtonProps {
  method: "POST" | "GET" | "DELETE";
  endpoint: string;
  data?: any;
  icon: React.ReactNode;
  id?: string;
  token?: string;
}

const ApiButton = ({
  method,
  endpoint,
  data,
  icon,
  id,
  token,
}: ApiButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [wished, setWished] = useState<{ id: string }[]>();
  const locale = useLocale();

  useEffect(() => {
    const res = fetch(
      `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/wishlist/get-wishlist?local=${locale}`,

      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res
      .then((res) => res.json())
      .then((data) => {
        setWished(data);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleClick = async () => {
    setLoading(true);

    try {
      const options: RequestInit = {
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };

      // Only include body for POST and DELETE requests
      if (method !== "GET" && data) {
        options.body = JSON.stringify(data);
      }

      // Making the request to the external API using the endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}${endpoint}`,
        options
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      setResponse(result);
      console.log("API response:", result);
    } catch (error) {
      console.error("API request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`${styles.favorite} ${response ? styles.added : ""} ${
          wished?.find((apartment) => apartment.id === id) ? styles.added : ""
        }`}
        onClick={handleClick}
      >
        {loading ? "..." : icon}
      </div>
    </>
  );
};

export default ApiButton;
