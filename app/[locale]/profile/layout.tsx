"use client";
import ImageComp from "@/Components/ImageComp/ImageComp";
import bgheader from "@/public/headerBG.png";
import { useParams, usePathname } from "next/navigation";
import { FaHome } from "react-icons/fa";
export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  // get the id
  const { id } = useParams();

  return (
    <div>
      <header className="g-mosaic-header">
        <ImageComp image={bgheader} alt="logo" />
        <h2
          style={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            textTransform: "uppercase",
            color: "white",
            fontSize: "clamp(10px, 4vw, 20px)",
          }}
        >
          PAYMENT
        </h2>
        <h2
          style={{
            position: "absolute",
            top: "70%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            textTransform: "uppercase",
            color: "white",
            width: "100%",
            textAlign: "center",
            margin: "auto",
            fontSize: "clamp(8px, 4vw, 16px)"
          }}
        >
          <FaHome />
          home{pathName.replace(`${id}`, "details")}
        </h2>
      </header>
      <main>{children}</main>
    </div>
  );
}
