"use client";
import React from "react";
import styles from "./button.module.css";
import { useRouter } from "next/navigation";

interface Props {
  onClicks: string;
  type: "submit" | "button" | "reset" | undefined;
  text: string | unknown;
}

export default function Button(props: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (props.onClicks) {
      router.push(props.onClicks);
    }
  };

  return (
    <button
      onClick={handleClick}
      type={props.type || "button"}
      className={styles.button}
    >
      {typeof props.text === "string" ? props.text : null}
    </button>
  );
}
