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
  "A free one-to-one supplier check for hotel housekeepers in Kathmandu from Ashutosh Trade.";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "One Supplier for Hotel Housekeeping | Ashutosh Trade",
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "One Supplier for Hotel Housekeeping | Ashutosh Trade",
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
    title: "One Supplier for Hotel Housekeeping | Ashutosh Trade",
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
