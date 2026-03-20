import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollWrapper from "./components/SmoothScroll";

export const metadata: Metadata = {
  title: ".",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollWrapper>{children}</SmoothScrollWrapper>
      </body>
    </html>
  );
}
