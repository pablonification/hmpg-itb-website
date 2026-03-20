import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const host = siteUrl.origin;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about-us", "/contact-us", "/reports", "/reports/"],
        disallow: ["/dashboard", "/dashboard/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host,
  };
}
