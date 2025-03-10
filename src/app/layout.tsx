import type { Metadata } from "next";
import "./globals.css";
import TawkToScript from "@/components/TawkToScript"; // Import the Tawk.to script component


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
    images: [{ url: "https://fbpdbcxjavianaboavoo.supabase.co/storage/v1/object/public/images//KwikFix-Logo-03-10-2025_09_53_PM.png" }],
  },
  twitter: {
    card: "handyman services platform",
    title: `${process.env.APP_NAME}`,
    description: `${process.env.APP_DESCRIPTION}`,
    images: ["https://fbpdbcxjavianaboavoo.supabase.co/storage/v1/object/public/images//KwikFix-Logo-03-10-2025_09_53_PM.png"],
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
