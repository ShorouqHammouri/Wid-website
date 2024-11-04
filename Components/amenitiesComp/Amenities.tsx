/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image"; // Import Image from Next.js
import styles from "./amenities.module.css"; // Assuming you have styles
import ImageComp from "../ImageComp/ImageComp"; // Custom ImageComp component if needed
import hasAirConditioning from "@/public/amenties/hasAirConditioning.png";
import hasBalcony from "@/public/amenties/hasBalcony.png";
import hasCleaningProducts from "@/public/amenties/hasCleaningProducts.png";
import hasClutery from "@/public/amenties/hasClutery.png";
import hasCoffeeMaker from "@/public/amenties/hasCoffeeMaker.png";
import hasDishwasher from "@/public/amenties/hasDishwasher.png";
import hasDryer from "@/public/amenties/hasDryer.png";
import hasEVCharger from "@/public/amenties/hasEVCharger.png";
import hasElevator from "@/public/amenties/hasElevator.png";
import hasEssentials from "@/public/amenties/hasEssentials.png";
import hasFreeParking from "@/public/amenties/hasFreeParking.png";
import hasFridge from "@/public/amenties/hasFridge.png";
import hasHairDryer from "@/public/amenties/hasHairDryer.png";
import hasHeating from "@/public/amenties/hasHeating.png";
import hasIron from "@/public/amenties/hasIron.png";
import hasKitchen from "@/public/amenties/hasKitchen.png";
import hasOven from "@/public/amenties/hasOven.png";
import hasShampoo from "@/public/amenties/hasShampoo.png";
import hasTv from "@/public/amenties/hasTv.png";
import hasWashingMachine from "@/public/amenties/hasWashingMachine.png";
import hasWheelchairAccess from "@/public/amenties/hasWheelchairAccess.png";
import hasWifi from "@/public/amenties/hasWifi.png";

interface Props {
  amenities:
    | {
        hasFreeParking: boolean;
        hasBalcony: boolean;
        hasWifi: boolean;
        hasTv: boolean;
        hasShampoo: boolean;
        hasHairDryer: boolean;
        hasKitchen: boolean;
        hasFridge: boolean;
        hasOven: boolean;
        hasElevator: boolean;
      }
    | any;
}

export default function Amenities(props: Props) {
  const amenities = props.amenities;
  const [showAll, setShowAll] = useState(false);

  // Map of amenity keys to their respective images
  const amenityImages: { [key: string]: any } = {
    ImageComp: ImageComp,
    hasAirConditioning: hasAirConditioning,
    hasBalcony: hasBalcony,
    hasCleaningProducts: hasCleaningProducts,
    hasClutery: hasClutery,
    hasCoffeeMaker: hasCoffeeMaker,
    hasDishwasher: hasDishwasher,
    hasDryer: hasDryer,
    hasEVCharger: hasEVCharger,
    hasElevator: hasElevator,
    hasEssentials: hasEssentials,
    hasFreeParking: hasFreeParking,
    hasFridge: hasFridge,
    hasHairDryer: hasHairDryer,
    hasHeating: hasHeating,
    hasIron: hasIron,
    hasKitchen: hasKitchen,
    hasOven: hasOven,
    hasShampoo: hasShampoo,
    hasTv: hasTv,
    hasWashingMachine: hasWashingMachine,
    hasWheelchairAccess: hasWheelchairAccess,
    hasWifi: hasWifi,
  };
  // Convert object into an array of key-value pairs
  const amenitiesArray = Object.entries(amenities);

  // Toggle between showing only 8 items or all items
  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  // Limit the number of amenities to show initially to 8
  const displayedAmenities = showAll
    ? amenitiesArray
    : amenitiesArray.slice(0, 8);

  return (
    <ul className={styles.amenitiesList}>
      {displayedAmenities.map(([key, value], index) => (
        <li key={index} className={styles.amenityItem}>
          {value ? (
            <Image
              src={amenityImages[key]} // Use the mapped image
              alt={key}
              width={15}
              height={15}
              className={styles.icon}
            />
          ) : (
            "No"
          )}{" "}
          {key.replace("has", "").replace(/([A-Z])/g, " $1")}{" "}
          {/* Clean key name */}
        </li>
      ))}
      <li className={styles.showMore} onClick={handleShowAll}>
        {showAll ? "Show Less" : "Show All"}
      </li>
    </ul>
  );
}
