import React from "react";
import dynamic from "next/dynamic";
import { BlinkBlur } from "react-loading-indicators";
const PaymentMainPage = dynamic(
  () => import("@/Components/paymentPage/PaymentMainPage"),
  {
    ssr: false,
    loading: () => (
      <section style={{ margin: "auto" }}>
        <BlinkBlur color={"#47b3c5"} size="large" text="loading" />,
      </section>
    ),
  }
);

export default async function paymentPage({
  params: { id },
  searchParams: { start_date, end_date, city, district },
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  return (
    <>
      <section style={{ margin: "auto" }}>
        <PaymentMainPage
          id={id}
          start_date={start_date}
          end_date={end_date}
          city={city}
          district={district}
        />
      </section>
    </>
  );
}
