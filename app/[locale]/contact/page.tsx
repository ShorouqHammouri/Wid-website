/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import contact from "@/public/HomePage/contact.png";
import styles from "./contact.module.css";
import { FaClock, FaLocationArrow, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { getLocale } from "next-intl/server";

export default async function contactPage() {
  const locale = getLocale();
  const fetchData = async (): Promise<any> => {
    try {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKENDAPI
        }/v1/app-settings/contact-info?locale=${await locale}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return res?.data || null;
    } catch (err : any) {
      console.log(err?.message);
    }
  };
  const company = await fetchData();
  const contacts = [
    {
      id: 1,
      icon: <FaPhoneAlt />,
      type: "Number",
      contact: company.companyPhoneNumber,
    },
    {
      id: 2,
      icon: <MdEmail />,
      type: "Email",
      contact: company.companyEmail,
    },
    {
      id: 3,
      icon: <FaLocationArrow />,
      type: "Find Us",
      contact: company.addressLine,
    },
  ];

  return (
    <>
      <Image
        src={contact}
        width={1000}
        height={1000}
        loading="eager"
        placeholder="empty"
        alt="contact"
        style={{
          width: "100vw",
          height: "auto",
          objectFit: "cover",
        }}
      />
      <section className={styles.contactPage}>
        {contacts.map((contact, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.icon}>{contact.icon}</div>
            <div className={styles.type}>{contact.type}</div>
            <div className={styles.contact}>{contact.contact}</div>
          </div>
        ))}
      </section>
        <section className={styles.text}>
          <div className={styles.icon}>
            <FaClock />
          </div>
          <div className={styles.type}>
            Working
          </div>
          <div className={styles.contact}>
            
              {`From ${company.startWeekDays} to ${company.endWeekDays}, ${company.startWorkingHours} to ${company.endWorkingHours}`}
    
          </div>
        </section>
    </>
  );
}
