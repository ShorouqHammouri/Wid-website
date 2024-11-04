import Header from "@/Components/Header/Header";
import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function HomePageLay(props: Props) {
  return (
    <>
      <header>
        <Header cookies={undefined} token={undefined} />
      </header>
      <div>{props.children}</div>
      <footer>
        <h1>Footer</h1>
      </footer>
    </>
  );
}
