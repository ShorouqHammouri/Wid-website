/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./paymentBtn.module.css";

interface ApiButtonProps {
  method: "POST" | "GET" | "DELETE";
  endpoint1: string;
  endpoint2: string;
  data?: any;
  text: string;
  width: string;
  token: string | undefined;
  locale: string | null;
}

const PaymentBtn = ({
  method,
  endpoint1,
  endpoint2,
  data,
  text,
  token,
}: // locale,
ApiButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClick = async () => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKENDAPI}${endpoint2}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        
      };

      if (method !== "GET" && data) {
        options.body = JSON.stringify(data);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}${endpoint1}`,
        options
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      }
      setResponse(result);
      setShowModal(true);
    } catch (error) {
      console.error("API request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Close modal when clicking outside of it
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <>
      {/* {token && token ? ( */}
      <>
        <div>
          <button onClick={handleClick} className={styles.button}>
            {loading ? "..." : `${text}`}
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal} ref={modalRef}>
              <h2>Redirecting</h2>
              <p>{response.message}</p>
            </div>
          </div>
        )}
      </>
      {/* ) : (
        <div>
          <Link href={`/${locale}/login`} className={styles.link}>
            <p>Please Login</p>
          </Link>
        </div>
      )} */}
    </>
  );
};

export default PaymentBtn;
