import React, { useState } from "react";
import axios from "axios";
import styles from "./account.module.css";

export default function Account({
  account,
  cookies,
}: {
  account:
    | {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | any;
  cookies: string | undefined;
}) {
  const [isEditing, setIsEditing] = useState({
    email: false,
    name: false,
    phoneNumber: false,
  });

  const [formData, setFormData] = useState({
    email: account?.email,
    firstName: account?.firstName,
    lastName: account?.lastName,
    phoneNumber: account?.phoneNumber,
  });

  const handleEditClick = (field: string) => {
    setIsEditing({
      ...isEditing,
      [field]: !isEditing[field as keyof typeof isEditing],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (field: string, edited: string) => {
    const token = cookies;
    console.log(field);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/user/update-profileInfo`,
        {
          [field]: formData[field as keyof typeof formData],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setIsEditing({ ...isEditing, [edited]: false });
        alert("Updated successfully");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      // alert("Error updating account");
    }
  };

  return (
    <>
      <section className={styles.accountSection}>
        {/* Email */}
        <div className={styles.field}>
          {isEditing.email ? (
            <>
              <label>
                <p>Email</p>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>
              <div className={styles.editBtns}>
                <button
                  className={styles.saveButton}
                  onClick={() => handleSubmit("email", "email")}
                >
                  Save
                </button>
                <button
                  className={styles.saveButton}
                  onClick={() => handleEditClick("email")}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.detail}>
                <p>Email</p>
                <span>{account.email}</span>
              </div>
              <button
                className={styles.editButton}
                onClick={() => handleEditClick("email")}
              >
                Edit
              </button>
            </>
          )}
        </div>

        {/* Name (First + Last) */}
        <div className={styles.field}>
          {isEditing.name ? (
            <>
              <div>
                <label>
                  <p>Name</p>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </label>
              </div>

              <div className={styles.editBtns}>
                <button
                  className={styles.saveButton}
                  onClick={() => {
                    handleSubmit("firstName", "name");
                    handleSubmit("lastName", "name");
                  }}
                >
                  Save
                </button>
                <button
                  className={styles.saveButton}
                  onClick={() => handleEditClick("name")}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.detail}>
                <p>Name</p>
                <span>
                  {account.firstName} {account.lastName}
                </span>
              </div>
              <button
                className={styles.editButton}
                onClick={() => handleEditClick("name")}
              >
                Edit
              </button>
            </>
          )}
        </div>

        {/* Phone Number */}
        <div className={styles.field}>
          {isEditing.phoneNumber ? (
            <>
              <label>
                <p>Phone Number</p>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>
              <div className={styles.editBtns}>
                <button
                  className={styles.saveButton}
                  onClick={() => handleSubmit("phoneNumber", "phoneNumber")}
                >
                  Save
                </button>
                <button
                  className={styles.saveButton}
                  onClick={() => handleEditClick("phoneNumber")}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.detail}>
                <p>Phone Number</p>
                <span>{account.phoneNumber}</span>
              </div>

              <button
                className={styles.editButton}
                onClick={() => handleEditClick("phoneNumber")}
              >
                Edit
              </button>
            </>
          )}
        </div>
      </section>
    </>
  );
}
