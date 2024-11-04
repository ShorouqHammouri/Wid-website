/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import styles from "./profileHeader.module.css";
import Image, { StaticImageData } from "next/image";
import { FaCamera } from "react-icons/fa";
import { BlinkBlur } from "react-loading-indicators";

export default function ProfileHeader(props: any) {
  const { profile } = props;
  const [profilePic, setProfilePic] = useState<string | StaticImageData>(
    profile.profilePicture
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to upload the new profile picture
  const uploadProfilePic = async (file: File) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/user/update-profile-picture`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TESTTOKEN}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setProfilePic(data.profilePicture);
      } else {
        setError("Failed to upload image");
      }
    } catch (err) {
      setError("Error while uploading image");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile picture change
  const changeProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      uploadProfilePic(file);
    }
  };

  return (
    <div className={styles.profileHeader}>
      <div className={styles.profilePic}>
        <div className={styles.imageFrame}>
          <label className={styles.profilePicForm} htmlFor="imageUpload">
            <Image
              src={profilePic}
              alt="profile"
              width={500}
              height={500}
              className={styles.profileImage}
              loading="eager"
              placeholder="empty"
            />
            <FaCamera className={styles.cameraIcon} />
          </label>
          <input
            id="imageUpload"
            type="file"
            name="profilePic"
            accept="image/*"
            style={{ display: "none" }}
            onChange={changeProfilePic}
          />
        </div>
      </div>
      <div className={styles.userName}>
        <span className={styles.firstName}>{profile.firstName}</span>
        <span className={styles.lastName}>{profile.lastName}</span>
      </div>

      {/* Show loading or error messages */}
      {loading && (
        <BlinkBlur color={"#47b3c5"} size="medium" style={{ margin: "auto" }} />
      )}
      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}
