import type { Metadata } from "next";

const SITE_NAME = "HMPG ITB";
const SITE_DESCRIPTION =
  "Website resmi Himpunan Mahasiswa Teknik Pangan ITB untuk profil organisasi, arsip kegiatan, laporan, dan kanal kontak.";
const DEFAULT_OG_IMAGE = "/assets/figma/home-hero-flag.png";

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);

function toAbsoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function getSiteUrl() {
  return siteUrl;
}

export function getDefaultSeoDescription() {
  return SITE_DESCRIPTION;
}

export function getDefaultSeoImage() {
  return DEFAULT_OG_IMAGE;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  authors,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  keywords?: string[];
}): Metadata {
  const resolvedImage = image ?? DEFAULT_OG_IMAGE;
  const absoluteUrl = toAbsoluteUrl(path);
  const absoluteImage = toAbsoluteUrl(resolvedImage);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: SITE_NAME,
      locale: "id_ID",
      type,
      images: [
        {
          url: absoluteImage,
          alt: title,
        },
      ],
      ...(type === "article"
        ? {
            publishedTime,
            authors,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImage],
    },
  };
}
