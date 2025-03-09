import type { Metadata } from "next";
import "./globals.css";
import TawkToScript from "@/components/TawkToScript"; // Import the Tawk.to script component
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: `${process.env.APP_NAME}`,
  description: `${process.env.APP_DESCRIPTION}`,
  keywords: " Kwikfix,Kwikfix.ng, handyman services, professional skills hire, local professionals, hire experts, home repairs, skilled workers, professional services, local talent, handyman platform, service providers, hire near you",
  author: "Acehub Technologies",

  robots: "index, follow",
  openGraph: {
    title: `${process.env.APP_NAME}`,
    description: `${process.env.APP_DESCRIPTION}`,
    url: process.env.APP_URL || "default-url.com",
    images: [{ url: "https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/logos/White-and-Blue-Shopping-Cart-Logo-DesignEvo-Logo-Maker-02-14-2025_08_47_PM.png" }],
  },
  twitter: {
    card: "handyman services platform",
    title: `${process.env.APP_NAME}`,
    description: `${process.env.APP_DESCRIPTION}`,
    images: ["https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/logos/White-and-Blue-Shopping-Cart-Logo-DesignEvo-Logo-Maker-02-14-2025_08_47_PM.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Other meta tags can go here */}
      </head>
      <body>
        {children}
        <TawkToScript /> {/* Load the Tawk.to script dynamically */}
      </body>
    </html>
  );
}
