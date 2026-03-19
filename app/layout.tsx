import type { Metadata } from "next";
import { Epilogue, Manrope } from "next/font/google";
import "./globals.css";

import { TextRevealObserver } from "@/components/site/text-reveal-observer";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "HMPG ITB",
    template: "%s | HMPG ITB",
  },
  description:
    "Website resmi Himpunan Mahasiswa Teknik Pangan ITB untuk profil organisasi, arsip kegiatan, laporan, dan kanal kontak.",
  openGraph: {
    title: "HMPG ITB",
    description:
      "Website resmi Himpunan Mahasiswa Teknik Pangan ITB untuk profil organisasi, arsip kegiatan, laporan, dan kanal kontak.",
    type: "website",
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
