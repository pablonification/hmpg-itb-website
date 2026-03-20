import type { Metadata } from "next";
import { Epilogue, Manrope } from "next/font/google";
import "./globals.css";

import { TextRevealObserver } from "@/components/site/text-reveal-observer";
import {
  getDefaultSeoDescription,
  getDefaultSeoImage,
  getSiteUrl,
} from "@/lib/seo";

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  weight: ["700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "HMPG ITB",
    template: "%s | HMPG ITB",
  },
  applicationName: "HMPG ITB",
  description: getDefaultSeoDescription(),
  keywords: [
    "HMPG ITB",
    "Himpunan Mahasiswa Teknik Pangan ITB",
    "Teknik Pangan ITB",
    "organisasi mahasiswa",
    "laporan HMPG ITB",
    "arsip kegiatan HMPG ITB",
  ],
  authors: [{ name: "HMPG ITB" }],
  creator: "HMPG ITB",
  publisher: "HMPG ITB",
  category: "education",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/assets/figma/hmpg-logo-mark.png",
        sizes: "531x531",
        type: "image/png",
      },
    ],
    shortcut: ["/assets/figma/hmpg-logo-mark.png"],
    apple: [
      {
        url: "/assets/figma/hmpg-logo-mark.png",
        sizes: "531x531",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "HMPG ITB",
    description: getDefaultSeoDescription(),
    type: "website",
    locale: "id_ID",
    siteName: "HMPG ITB",
    url: "/",
    images: [
      {
        url: getDefaultSeoImage(),
        alt: "HMPG ITB",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HMPG ITB",
    description: getDefaultSeoDescription(),
    images: [getDefaultSeoImage()],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${epilogue.variable} ${manrope.variable} antialiased`}>
        <TextRevealObserver />
        {children}
      </body>
    </html>
  );
}
