/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/Components/Buttons/Button";
import Image from "next/image";
import React from "react";
import styles from "./history.module.css";
import { useLocale } from "next-intl";

export default async function History({
  history,
}: {
  cookies: string | any;
  history:
    | {
        id: string;
        checkInDate: string;
        checkOutDate: string;
        bookingStatus: string;
        createdAt: string;
        Apartment: {
          id: string;
          name: string;
          ApartmentAddress: {
            district: string;
            city: string;
          };
          ApartmentImage: string;
          PaymentAmount: null;
          CancellationPolicy: {
            id: string;
            fullRefundDeadlineHours: number;
            cancellationType: string;
            refundPercentage: number;
          };
          refundableAmount: null;
        };
      }[]
    | null
    | any;

}) {
  const locale: "en" | "ar" | unknown = useLocale();
  return (
    <>
      <section className={styles.card}>
        <ul>
          {history &&
            history.map(async (history: any, index: number) => (
              <>
                <li key={index} className={styles.singleCard}>
                  <div className={styles.image}>
                    <Image
                      src={history.Apartment.ApartmentImage}
                      alt="Apartment"
                      width={100}
                      height={100}
                      loading="lazy"
                      placeholder="empty"
                    />
                  </div>
                  {/* apartment name */}
                  <div className={styles.apartmentName}>
                    <p>{history.Apartment.name}</p>
                  </div>
                  {/* in & out */}
                  <div className={styles.inOut}>
                    <div className={styles.chIn}>
                      <p>checkIn</p>
                      <span>{history.checkInDate.split("T")[0]}</span>
                    </div>
                    <div className={styles.inOutLine}></div>
                    <div className={styles.chOut}>
                      <p>checkOut</p>
                      <span>{history.checkOutDate.split("T")[0]}</span>
                    </div>
                  </div>
                  {/* view apartment button */}
                  <div className={styles.viewButton}>
                    <Button
                      text="View Apartment"
                      onClicks={`/${await locale}/apartments/${
                        history.Apartment.id
                      }`}
                      type={undefined}
                    />
                  </div>
                </li>
              </>
            ))}
        </ul>
      </section>
    </>
  );
}
