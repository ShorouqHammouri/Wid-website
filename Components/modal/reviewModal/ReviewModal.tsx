"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "../modalBtn.module.css";
import style from "./reviewModal.module.css";

interface ApiButtonProps {
  method: "POST" | "GET" | "DELETE";
  endpoint: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  text: string;
  width: string;
}

const ReviewModal = ({ method, endpoint, data, text }: ApiButtonProps) => {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  console.log(response);
  

  const handleClick = async () => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };

      if (method !== "GET" && data) {
        options.body = JSON.stringify(data);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDAPI}${endpoint}`, options);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
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
      <div>
        <button
          onClick={() => {
            setShowModal(true);
          }}
          className={styles.button}
        >
          {loading ? "..." : `${text}`}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} ref={modalRef}>
            <h2>Leave your review!</h2>
            <form
              onSubmit={handleClick}
              method="post"
              action={`${process.env.NEXT_PUBLIC_BACKENDAPI}${endpoint}`}
            >
              <textarea
                className={style.textArea}
                name="review"
                id="review"
                cols={50}
                rows={10}
                placeholder="Review"
                required
              ></textarea>
              <button className={style.button} type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewModal;
