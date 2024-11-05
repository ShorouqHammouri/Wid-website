/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import styles from "./payment.module.css";
import pic from "@/public/payment-page-room.jpeg";
import logo from "@/public/hotelLogo.jpeg";
import { RiHotelFill } from "react-icons/ri";
import { getLocale, getTranslations } from "next-intl/server";
import axios from "axios";
import { BiLocationPlus } from "react-icons/bi";
import Image from "next/image";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import ApartmentReviews from "../ApartmentReviews/ApartmentReviews";
import PaymentBtn from "../Buttons/paymentBtn/PaymentBtn";
const Visa = dynamic(() => import("@/Components/Visa/Visa"), { ssr: false });
const DateSelect = dynamic(() => import("./dateSelect/DateSelect"), {
  ssr: false,
});
type ApiResponse = {
  message: string;
  booking: {
    localizedBookedApartment: {
      bookingId: string;
      totalPrice: number;
      cleaningFee: number;
      vat: number;
      checkInDate: string;
      checkOutDate: string;
      numberOfNights: number;
      isOfferApplied: boolean;
      totalNightsPrice: number;
      bookingStatus: string;
      Apartment: {
        name: string;
        nightlyPrice: number;
        ApartmentImage: string;
        avgRating: number;
        reviewCount: number;
        ApartmentAddress: {
          addressLine: string;
          District: {
            name: string;
            City: {
              name: string;
            };
          };
        };
      };
    };
    priceWithoutOffer: {
      NightsPrice: number;
      cleaningFee: number;
      vat: number;
      total: number;
    };
  };
  userBillingDetails: {
    id: string;
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    createdAt: string;
    updatedAt: string;
  };
};

type Data = {
  id: number;
  title: string;
  data: {
    id: string;
    name: string;
    description: string;
    nightlyPrice: number;
    ApartmentAddress: {
      addressLine: string;
      City: { id: number; name: string };
      District: { id: number; name: string };
      longitude: number;
      latitude: number;
    };
    ApartmentImages: {
      id: string;
      imageUrl: string;
    }[];
    ApartmentAmenities: {
      hasAirConditioning: boolean;
      hasBalcony: boolean;
      hasCleaningProducts: boolean;
      hasClutery: boolean;
      hasCoffeeMaker: boolean;
      hasDishwasher: boolean;
      hasDryer: boolean;
      hasEVCharger: boolean;
      hasElevator: boolean;
      hasEssentials: boolean;
      hasFreeParking: boolean;
      hasFridge: boolean;
      hasHairDryer: boolean;
      hasHeating: boolean;
      hasIron: boolean;
      hasKitchen: boolean;
      hasOven: boolean;
      hasShampoo: boolean;
      hasTv: boolean;
      hasWashingMachine: boolean;
      hasWheelchairAccess: boolean;
      hasWifi: boolean;
    };
    avgRating: number;
    reviewCount: number;
    isWished: boolean;
  };
};

type props = {
  start_date: string;
  end_date: string;
  city: string;
  district: string;
  id: number;
};

export default async function PaymentMainPage({
  start_date,
  end_date,
  id,
}: props) {
  const t = getTranslations("Payment");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locale: "en" | "ar" | any = getLocale();

  const cookiez = cookies();
  const token = cookiez.get("jwt")?.value;
  // const token = process.env.NEXT_PUBLIC_TESTTOKEN;

  async function formatDate(dateString: string) {
    const options: { weekday: string; month: string; day: string } | any = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(
      `${(await locale) === "en" ? "en-US" : "ar-EG"}`,
      options
    );
  }

  const startDate = formatDate(start_date);
  const endDate = formatDate(end_date);

  // Fetch data (SSR)

  const fetchBill = async (): Promise<ApiResponse | null> => {
    if (start_date && end_date) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/apartments/${id}/book`,
          // /v1/apartments/${id}/book
          {
            checkInDate: start_date,
            checkOutDate: end_date,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        return res?.data || null;
      } catch (err) {
        return null;
      }
    } else {
      return null;
    }
  };
  const fetchApartmentData = async (): Promise<Data | null> => {
    try {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKENDAPI
        }/v1/apartments/${id}?locale=${await locale}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res?.data || null;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const billData: ApiResponse | null = await fetchBill();
  const apartmentData: Data | null = await fetchApartmentData();
  const bill = billData?.booking?.localizedBookedApartment;
  const apartment = apartmentData?.data;

  return (
    <>
      <section className="g-container" style={{ width: "100vw" }}>
        <div className={styles.paymentCard}>
          <section className={styles.paymentCardImage}>
            <Image
              width={500}
              height={500}
              placeholder="empty"
              loading="eager"
              src={pic}
              alt="Pic your home"
              className={styles.image}
            />
          </section>

          <div className={styles.cardsSection}>
            <section className={styles.detailsCard}>
              <div className={styles.roomDetails}>
                <div className={styles.roomDescription}>
                  <p>{apartment?.name}</p>
                </div>
                <div className={styles.roomDetailsPrice}>
                  <p>${apartment?.nightlyPrice}</p>
                  <span>/night</span>
                </div>
              </div>

              <div className={styles.locationDetails}>
                <div className={styles.hotelLogo}>
                  {/* 5ali balak el style... */}
                  <Image
                    width={100}
                    height={100}
                    src={logo}
                    alt="Room for payment"
                    className={styles.image}
                  />
                </div>
                <div className={styles.hotelLocation}>
                  <div className={styles.hotelName}>
                    <p>{apartment?.name}</p>
                  </div>
                  <div className={styles.hotelLocationPin}>
                    <p>
                      <span>
                        <BiLocationPlus />
                      </span>
                      {`${apartment?.ApartmentAddress.addressLine}, ${apartment?.ApartmentAddress.City.name}, ${apartment?.ApartmentAddress.District.name}`}
                    </p>
                  </div>
                </div>
              </div>
              {(await startDate) === "Invalid Date" &&
              (await endDate) === "Invalid Date" ? (
                <>
                  <div className={styles.noBookingTime}>
                    <DateSelect id={id} />
                  </div>
                </>
              ) : (
                <div className={styles.bookingTime}>
                  <div className={styles.bookingCheck}>
                    <div className={styles.bookingCheckDate}>
                      <p>{startDate}</p>
                    </div>
                    <p className={styles.bookingP}>check in</p>
                  </div>
                  <div className={styles.bookingLogo}>
                    <span>
                      <RiHotelFill />
                    </span>
                  </div>
                  <div className={styles.bookingCheck}>
                    <div className={styles.bookingCheckDate}>
                      <p>{endDate}</p>
                    </div>
                    <p className={styles.bookingP}>check out</p>
                  </div>
                </div>
              )}
            </section>
            {/* bill */}
            {bill && bill ? (
              <section className={styles.chechoutCard}>
                <div className={styles.chechoutCardRoom}>
                  <div className={styles.roomOwner}>
                    <p>{bill?.Apartment?.name}</p>
                  </div>
                  <div className={styles.roomDetails}>
                    <p>{bill?.Apartment?.name}</p>
                  </div>
                  <div className={styles.roomRating}>
                    <ApartmentReviews rate={bill?.Apartment?.avgRating} />
                  </div>
                  <div className={styles.roomProtection}>
                    <p>Your booking is protected by trevala</p>
                  </div>
                </div>
                {/* UI works */}
                <div className={styles.chechoutCardBill}>
                  <div className={styles.chechoutBillHeader}>
                    <p>{(await t)("title")}</p>
                  </div>
                  <div className={styles.chechoutBill}>
                    <ul>
                      <li>
                        <p>Base Fare</p>
                        <span> $ {bill?.totalNightsPrice}</span>
                      </li>
                      <li>
                        <p>Cleaning fee</p>
                        <span> $ {bill?.cleaningFee}</span>
                      </li>
                      <li>
                        <p>Taxes (VAT. 15%)</p>
                        <span> $ {bill?.vat}</span>
                      </li>
                      <li className={styles.chechoutBillTotal}>
                        <p>Total</p>
                        <span> $ {bill?.totalPrice}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            ) : (
              <>
                <section className={styles.chechoutCard}>
                  <div className={styles.noDate}>please select a date</div>
                </section>
              </>
            )}

            <section className={styles.visa}>
              <Visa />
            </section>
            <section className={styles.pay}>
              <PaymentBtn
                text="Pay Now"
                method="POST"
                data={{ checkInDate: "2024-10-30", checkOutDate: "2024-10-31" }}
                endpoint1={`/v1/booking/create-paytabs-session/${apartment?.id}`}
                endpoint2={`/v1/booking/check-availability-and-lock/${apartment?.id}`}
                width="100%"
                token={token}
                locale={await locale}
              />
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
