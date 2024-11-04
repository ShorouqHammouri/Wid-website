/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./apartments.module.css";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { FaBed, FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt, FaLocationArrow } from "react-icons/fa";
import { OrbitProgress } from "react-loading-indicators";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import NoApartmentsAvailable from "./noApartment/NoApartmentsAvailable";

const CardAp = dynamic(
  () => import("@/Components/Cards/ApartmentCard/CardAp"),
  {
    ssr: false,
    loading: () => (
      <OrbitProgress
        style={{ margin: "auto" }}
        variant="dotted"
        dense
        color={"#47b3c5"}
        size="large"
      />
    ),
  }
);

// Define Data type properly
type City = { id: number; name: string };
type District = { id: number; name: string };
type CityList = { cities: { id: number; name: string }[] };
type DistrictList = { districts: { id: number; name: string }[] };
type Data = {
  id: number;
  name: string;
  nightlyPrice: number;
  avgRating: number;
  reviewCount: number;
  isWished: boolean;
  ApartmentAddress: {
    addressLine: string;
    City: City;
    District: District;
  };
  ApartmentImages: { id: string; imageUrl: string }[];
};
export default function ApartmentsPage({
  start_date,
  end_date,
  city,
  district,
  token,
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("SearchPage");

  // screen width handling
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      // Only update the state if the width is different
      if (currentWidth !== screenWidth) {
        setScreenWidth(currentWidth);
      }
    };

    // Set the initial screen width on mount
    setScreenWidth(window.innerWidth);

    // Add the resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [screenWidth]);
  const isMobile = screenWidth <= 800;

  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locale: "en" | "ar" | any = useLocale();

  // date selection Calendar
  const [range, setRange] = useState<any>([
    {
      startDate: new Date(new Date().toISOString().split("T")[0]),
      endDate: new Date(addDays(new Date(), 1).toISOString().split("T")[0]),
      key: "selection",
    },
  ]);
  // handle open/close menu 🔽
  // ---------------------------
  // calendar
  const [showCal, setShowCal] = useState(false);
  // city
  const [showCity, setShowCity] = useState(false);
  // district
  const [showDistrict, setShowDistrict] = useState(false);
  //
  // manage ref()
  const calendarRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);

  // Function to handle clicks outside of the calendar

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCal(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCity(false);
      }
      if (
        districtRef.current &&
        !districtRef.current.contains(event.target as Node)
      ) {
        setShowDistrict(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ------------------------------------------

  // fetch data 🔽
  // --------------
  const [cities, setCities] = useState<CityList>();
  const cityList = useMemo(() => cities, [cities]);

  const [districtF, setDistrictF] = useState<DistrictList | null>(null);
  const districtList = useMemo(() => districtF, [districtF]);
  const [apartments, setApartments] = useState<Data[] | null>(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // selection handling 🔽
  // city
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [selectedcity, setSelectedcity] = useState<City | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );

  const handleSelect = (ranges: RangeKeyDict | any) => {
    const selectedStartDate: string | any = ranges.selection.startDate;
    const selectedEndDate: string | any = ranges.selection.endDate;

    // Ensure the date is handled in UTC
    const utcStart: string | any = new Date(
      Date.UTC(
        selectedStartDate.getFullYear(),
        selectedStartDate.getMonth(),
        selectedStartDate.getDate()
      )
    );
    const utcEnd: string | any = new Date(
      Date.UTC(
        selectedEndDate.getFullYear(),
        selectedEndDate.getMonth(),
        selectedEndDate.getDate()
      )
    );

    // Format the dates as "YYYY-MM-DD"
    setSelectedStart(utcStart.toISOString().split("T")[0]);
    setSelectedEnd(utcEnd.toISOString().split("T")[0]);

    setRange([ranges.selection]);
  };

  // fetch cities
  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKENDAPI
        }/v1/search/cities?locale=${locale}&districtId=${
          selectedDistrict ? selectedDistrict.id : "1"
        }`
      );
      const data = await res.json();
      setCities(data);
    }
    fetchPosts();
  }, [selectedDistrict]);

  // fetch distcricts
  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKENDAPI
        }/v1/search/city-districts?cityId=${
          selectedcity ? selectedcity.id : "1"
        }&locale=${locale}`
      );
      const data = await res.json();
      setDistrictF(data);
    }
    fetchPosts();
  }, [selectedcity]);

  // Fetch apartments
  // handleSearch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    const fetchApartments = async () => {
      if (
        pathname === `/${await locale}/apartments` &&
        start_date &&
        end_date &&
        city &&
        district
      ) {
        setLoading(true);
        try {
          const res = await fetch(
            `${
              process.env.NEXT_PUBLIC_BACKENDAPI
            }/v1/search/search-apartments?checkInDate=${start_date}&checkOutDate=${end_date}&districtId=${await district}&locale=${locale}`
          );
          const data = await res.json();
          if (Array.isArray(data)) {
            setApartments(data);
            setErrorMessage(null);
          } else {
            setErrorMessage(data);
            setApartments(null);
          }
        } catch ( error : any) {
          setErrorMessage(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApartments();
  }, [pathname, start_date, end_date, city, district, locale]);

  const handleSearch = async (event: any) => {
    event.preventDefault();

    if (!selectedStart || !selectedEnd || !selectedcity || !selectedDistrict) {
      return;
    }
    if (pathname === `/${await locale}`) {
      router.push(
        `/${await locale}/apartments?start_date=${selectedStart}&end_date=${selectedEnd}&city=${
          selectedcity.id
        }&district=${selectedDistrict.id}`
      );
      return;
    }

    setLoading(true);
    console.log(selectedDistrict);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/search/search-apartments?checkInDate=${selectedStart}&checkOutDate=${selectedEnd}&districtId=${selectedDistrict.id}&locale=${locale}`
    );
    const data = await res.json();
    if (Array.isArray(data)) {
      setErrorMessage(null);
      setApartments(data);
      setLoading(false);
    } else {
      setApartments(null);
      setErrorMessage(data);
      setApartments(null);
      setLoading(false);
    }
  };

  // Render the apartments
  return (
    <>
      <section className={styles.apartmentSearchPage}>
        <section className={styles.searchBar}>
          {/* searchbar header */}
          <div className={styles.searchBarHeader}>
            <h4>
              <span>
                <FaBed className={styles.searchBarHeaderIcon} />
              </span>
              {t("title")}
            </h4>
          </div>
          <div className={styles.searchingArea}>
            <div className={styles.searchingItems}>
              {/* calendar */}
              <div className={styles.selectDateArea}>
                <div
                  className={styles.selectButton}
                  onClick={() => setShowCal(!showCal)}
                >
                  <span>
                    <FaCalendarAlt className={styles.selectButtonIcon} />
                  </span>
                  <p>
                    <span className={styles.selectText}>{t("date")}</span>
                    <span style={{ fontSize: "clamp(12px, 4vw, 20px)" }}>
                      {selectedStart && selectedEnd
                        ? `${selectedStart} - ${selectedEnd}`
                        : t("selectDate")}
                    </span>
                  </p>
                </div>
                {showCal && (
                  <div
                    dir="ltr"
                    ref={calendarRef}
                    className={styles.calendarContainer}
                  >
                    <DateRange
                      editableDateInputs={true}
                      onChange={handleSelect}
                      moveRangeOnFirstSelection={false}
                      ranges={range}
                      months={isMobile ? 1 : 2}
                      direction="horizontal"
                      rangeColors={["#4F8F92", "#4F8F92"]}
                      showDateDisplay={false}
                      minDate={new Date()}
                      weekdayDisplayFormat="EEEEE"
                    />
                    <button
                      onClick={() => {
                        setShowCal(!showCal);
                      }}
                      className={styles.applyButton}
                    >
                      {t("apply")}
                    </button>
                  </div>
                )}
              </div>
              {/* city */}
              <div className={styles.selectCityArea}>
                <div
                  className={styles.selectButton}
                  onClick={() => setShowCity(!showCity)}
                >
                  <span>
                    <FaLocationArrow className={styles.selectButtonIcon} />
                  </span>
                  <p>
                    <span className={styles.selectText}>{t("city")}</span>
                    <span style={{ fontSize: "clamp(12px, 4vw, 20px)" }}>
                      {selectedcity && selectedcity
                        ? `${selectedcity.name}`
                        : t("selectCity")}
                    </span>
                  </p>
                </div>
                {showCity && (
                  <div ref={cityRef} className={styles.selectionContainer}>
                    <ul>
                      {cityList &&
                        cityList?.cities.map((city, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setSelectedcity(city);
                            }}
                          >
                            <FaLocationDot className={styles.listIcon} />
                            <p>{city.name}</p>
                          </li>
                        ))}
                    </ul>
                    <button
                      onClick={() => {
                        setShowCity(false);
                      }}
                      className={styles.applyButton}
                    >
                      {t("apply")}
                    </button>
                  </div>
                )}
              </div>
              {/* district */}
              <div className={styles.selectDistrictArea}>
                <div
                  className={styles.selectButton}
                  onClick={() => setShowDistrict(!showDistrict)}
                >
                  <span>
                    <FaLocationArrow className={styles.selectButtonIcon} />
                  </span>
                  <p>
                    <span className={styles.selectText}>{t("district")}</span>
                    <span style={{ fontSize: "clamp(12px, 4vw, 20px)" }}>
                      {selectedDistrict && selectedDistrict
                        ? `${selectedDistrict.name}`
                        : t("selectDistrict")}
                    </span>
                  </p>
                </div>
                {showDistrict && (
                  <div
                    ref={districtRef}
                    className={styles.selectionContainer}
                    style={{ zIndex: "9999" }}
                  >
                    <ul>
                      {districtList &&
                        districtList?.districts.map((dist, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setSelectedDistrict(dist);
                            }}
                            className={styles.cityList}
                          >
                            <FaLocationDot className={styles.listIcon} />
                            <p>{dist.name}</p>
                          </li>
                        ))}
                    </ul>
                    <button
                      onClick={() => {
                        setShowDistrict(false);
                      }}
                      className={styles.applyButton}
                    >
                      {t("apply")}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button className={styles.searchButton} onClick={handleSearch}>
              {loading ? t("loading") : t("search")}
            </button>
          </div>
        </section>
        {/* <div className={styles.cards}>Rooms</div> */}
        <div className={styles.cards} style={{}}>
          {loading ? (
            <div className={styles.loader}>
              <span></span>
            </div>
          ) : errorMessage && errorMessage ? (
            <p>Please set feileds correctly...</p>
          ) : apartments && apartments ? (
            apartments.length > 0 ? (
              apartments?.map((apartment, index) => (
                <div
                  key={index}
                  style={{ zIndex: "1" }}
                  className={styles.cardAp}
                >
                  <CardAp
                    onClicks={`?start_date=${
                      selectedStart ? selectedStart : start_date
                    }&end_date=${selectedEnd ? selectedEnd : end_date}&city=${
                      selectedcity?.id ? selectedcity?.id : city
                    }&district=${
                      selectedDistrict?.id ? selectedDistrict?.id : district
                    }`}
                    apartmentData={apartment}
                    token={token}
                  />
                </div>
              ))
            ) : (
              <NoApartmentsAvailable />
            )
          ) : null}
        </div>
      </section>
    </>
  );
}
