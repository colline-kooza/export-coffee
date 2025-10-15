import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/ReactQueryClient";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const inter = Inter({
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | AdMarket Pro",
    absolute: "AdMarket Pro - Premium Ecommerce Advertising Platform",
  },
  description:
    "Connect with thousands of vendors and discover amazing deals on AdMarket Pro. The ultimate marketplace for product advertisements, shop promotions, and vendor showcases. Find everything you need in one place.",
  keywords: [
    "ecommerce marketplace",
    "product ads",
    "vendor advertisements",
    "online shopping",
    "business marketplace",
    "product promotion",
    "vendor platform",
    "digital marketplace",
    "retail advertising",
    "shop promotions",
  ],
  authors: [{ name: "AdMarket Pro Team" }],
  creator: "AdMarket Pro",
  publisher: "AdMarket Pro",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "AdMarket Pro - Premium Ecommerce Advertising Platform",
    description:
      "Discover thousands of vendor advertisements and amazing deals. The ultimate marketplace connecting buyers with sellers worldwide.",
    siteName: "AdMarket Pro",
    images: [
      {
        url: "/og-image.jpg", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "AdMarket Pro - Ecommerce Ads Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AdMarket Pro - Premium Ecommerce Advertising Platform",
    description:
      "Discover thousands of vendor advertisements and amazing deals on our marketplace platform.",
    images: ["/twitter-image.jpg"], // You'll need to create this image
    creator: "@MJohnbpatist", // Replace with your actual Twitter handle
  },
  alternates: {
    canonical: "https://your-domain.com", // Replace with your actual domain
  },
  category: "ecommerce",
  classification: "Business & Shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <QueryProvider>
          <Toaster richColors />
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
