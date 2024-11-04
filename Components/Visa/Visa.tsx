"use client";
import React, { useState } from "react";
import styles from "./visa.module.css";
import { FaCcVisa } from "react-icons/fa6";

export default function Visa() {
  // const [select, setSelect] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState("Visa");
  // const [visaNumber, setVisaNumber] = useState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchData = async (): Promise<any> => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/booking/user/get-saved-cards`,
      {
        mode: "no-cors",
        method: "GET",
      }
    )
      .then(async (response) => {
        // Limited access to response details due to no-cors mode
        console.log(await response.json());
        // setVisaNumber(response.body);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  fetchData();

  // console.log(visaNumber);

  const visaOptions = [
    {
      type: <FaCcVisa />,
      name: "********4524",
      exp: "10/27",
    },
    {
      type: <FaCcVisa />,
      name: "********4522",
      exp: "12/27",
    },
  ];
  const handleVisaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedVisa(event.target.value);
    // setSelect(true);
  };
  return (
    <>
      <div className={styles.visa}>
        <form>
          {visaOptions.map((visa, index) => (
            <label
              key={index}
              style={{
                backgroundColor:
                  selectedVisa === visa.name
                    ? "var(--green)"
                    : "var(--background)",
                color:
                  selectedVisa === visa.name
                    ? "var(--background)"
                    : "var(--notBlack)",
              }}
              className={styles.visaForm}
            >
              <div className={styles.visaDetails}>
                <span>{visa.type}</span>
                <div className={styles.visaData}>
                  <span className={styles.visaName}>{visa.name}</span>
                  <span className={styles.visaExp}>{visa.exp}</span>
                </div>
              </div>

              <input
                type="radio"
                name="visa"
                value={visa.name}
                checked={selectedVisa === visa.name}
                onChange={handleVisaChange}
                style={{
                  accentColor:
                    selectedVisa === visa.name
                      ? "var(--background)"
                      : "var(--notBlack)",
                }}
              />
            </label>
          ))}
        </form>
      </div>
    </>
  );
}
