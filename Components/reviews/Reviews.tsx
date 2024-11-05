/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import styles from "./reviews.module.css";
import axios from "axios";
import Image from "next/image";
import { OrbitProgress } from "react-loading-indicators";
import userSvg from "./user.svg";
interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Review {
  id: string;
  rating: number;
  review: string;
  createdAt: string;
  User: User;
}

interface Props {
  id: string;
}

export default function Reviews(props: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Set initial limit
  const [reviews, setReviews] = useState<Review[]>([]);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  // Handle window resize and set screen width
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial screen width
    setScreenWidth(window.innerWidth);

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Adjust limit based on screen width
  useEffect(() => {
    if (screenWidth <= 800) {
      setLimit(2); // Adjust limit for mobile
    } else {
      setLimit(5); // Default limit for larger screens
    }
  }, [screenWidth]); // Re-run the effect when screen width changes

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews when page or limit changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/apartments/${props.id}/reviews?page=${page}&limit=${limit}`
        );
        setReviews(response.data);
        setLoading(false);
      } catch (err : any) {
        setError(`Failed to fetch data: ${err?.message}`);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [page, limit, props.id]);

  if (loading)
    return (
      <OrbitProgress variant="dotted" dense color={"#47b3c5"} size="large" />
    );
  if (error) return <p>{error}</p>;

  return (
    <section className={styles.reviewSubContainer}>
      {reviews &&
        reviews.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewCardImg}>
              {review.User.avatar ? (
                <Image
                  width={100}
                  height={100}
                  src={review.User.avatar}
                  alt="p"
                />
              ) : (
                <Image width={100} height={100} src={userSvg} alt="p" />
              )}
            </div>
            <div className={styles.reviewCardSection}>
              <div className={styles.reviewCardInfo}>
                <div className={styles.reviewCardRate}>
                  {review.rating}{" "}
                  {(review.rating / 5) * 100 > 85
                    ? "Excellent"
                    : (review.rating / 5) * 100 > 70
                    ? "Very Good"
                    : "Good"}{" "}
                  |
                </div>

                <div className={styles.reviewUserName}>
                  <span>{review.User.firstName}</span>
                </div>
              </div>
              <div className={styles.reviewCardText}>
                <span>{review.review}</span>
              </div>
            </div>
          </div>
        ))}

      <div className={styles.reviewPagination}>
        <button
          onClick={() => setPage((prevPage) => prevPage - 1)}
          disabled={page === 1}
        >
          {"<"}
        </button>
        <span>{page}</span>
        <button
          onClick={() => setPage((prevPage) => prevPage + 1)}
          disabled={reviews?.length < limit}
        >
          {">"}
        </button>
      </div>
    </section>
  );
}
