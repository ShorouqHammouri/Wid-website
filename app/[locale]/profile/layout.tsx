"use client";
import Breadcrumb from "@/Components/breadCrumb/BreadCrumb";

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="g-mosaic-header">
        <Breadcrumb />
      </header>
      <main>{children}</main>
    </div>
  );
}
