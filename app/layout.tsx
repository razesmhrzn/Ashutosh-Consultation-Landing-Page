import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getSiteUrl } from "@/lib/config";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

const description =
  "Download a free 30-point facility supplies and cleaning operations audit for hospitals, schools, hotels, commercial buildings, and offices.";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Free Facility Supplies Audit Toolkit | Ashutosh Trade",
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free Facility Supplies Audit Toolkit | Ashutosh Trade",
    description,
    url: "/",
    siteName: "Ashutosh Trade",
    type: "website",
    images: [
      {
        url: "/logo.png",
        alt: "Ashutosh Trade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Facility Supplies Audit Toolkit | Ashutosh Trade",
    description,
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} font-sans`}>{children}</body>
    </html>
  );
}
