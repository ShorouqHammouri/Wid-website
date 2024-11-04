/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { addDays } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import styles from "./dateSelect.module.css";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  id: string | number | null | unknown;
};
type City = { id: number; name: string };
type District = { id: number; name: string };
export default function DateSelect(props: Props) {
  // next imports
  const locale = useLocale();
  const t = useTranslations("SearchPage");
  const router = useRouter();

  // start screen width handling
  // -----------------------------
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
  // end screen width handling
  // -----------------------------
  // -----------------------------
  // start calendar handling
  // -----------------------------
  const [range, setRange] = useState<any>([
    {
      startDate: new Date().toISOString().split("T")[0],
      endDate: addDays(new Date(), 1).toISOString().split("T")[0],
      key: "selection",
    },
  ]);

  // manage ref()
  const calendarRef = useRef<HTMLDivElement>(null);
  // handle open/close menu 🔽
  // ---------------------------
  // calendar
  const [showCal, setShowCal] = useState(false);

  const [selectedcity, setSelectedcity] = useState<City | any>();
  //  district
  const [selectedDistrict, setSelectedDistrict] = useState<District | any>();
  // start and end date
  const [selectedStart, setSelectedStart] = useState<string | undefined>();
  const [selectedEnd, setSelectedEnd] = useState<string | undefined>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/apartments/${props.id}?locale=${locale}`
      )
      .then((res) => {
        setSelectedcity(res.data.data.ApartmentAddress.City.id);
        setSelectedDistrict(res.data.data.ApartmentAddress.District.id);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSelect = (ranges: RangeKeyDict) => {
    const selectedStartDate: any = ranges.selection.startDate;
    const selectedEndDate: any = ranges.selection.endDate;

    const utcStart = new Date(
      Date.UTC(
        selectedStartDate.getFullYear(),
        selectedStartDate.getMonth(),
        selectedStartDate.getDate()
      )
    );
    const utcEnd = new Date(
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

  const handleRoute = useCallback(() => {
    router.push(
      `/${locale}/apartments/${props.id}/payment?start_date=${selectedStart}&end_date=${selectedEnd}&city=${selectedcity}&district=${selectedDistrict}`
    );
  }, [
    locale,
    props.id,
    selectedStart,
    selectedEnd,
    selectedcity,
    selectedDistrict,
    router,
  ]);

  const [excludedDate, setExcludedDates] = useState<
    { start: string; end: string }[]
  >([]);
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/v1/apartments/${props.id}/unavailable-dates`
      )
      .then((res) => setExcludedDates(res.data))
      .catch((err) => console.log(err));
  }, []);

  const disabledDates = useMemo(() => {
    const dates: Date[] = [];
    excludedDate.forEach((range) => {
      const startDate = new Date(range.start);
      const endDate = new Date(range.end);

      for (
        let currentDate = new Date(startDate);
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        dates.push(new Date(currentDate));
      }
    });
    return dates;
  }, [excludedDate]);

  return (
    <>
      {/* calendar */}
      <div className={styles.selectDateArea}>
        <div
          className={styles.selectButton}
          onClick={() => setShowCal(!showCal)}
        >
          <p>
            <span className={styles.selectText}>{t("date")}</span>
            <span className={styles.selectText}>
              {selectedStart && selectedEnd
                ? `${selectedStart} - ${selectedEnd}`
                : t("selectDate")}
            </span>
            <span>
              <FaCalendarAlt className={styles.selectButtonIcon} />
            </span>
          </p>
        </div>
        {showCal && (
          <div dir="ltr" ref={calendarRef} className={styles.calendarContainer}>
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
              disabledDates={disabledDates}
            />
            <button
              onClick={() => {
                setShowCal(!showCal);
                handleRoute();
              }}
              className={styles.applyButton}
            >
              {t("apply")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
