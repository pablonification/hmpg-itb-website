import type { MetadataRoute } from "next";

import { getPublishedReports } from "@/lib/repositories/content-repository";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const publishedReports = await getPublishedReports();
  const staticRoutes = [
    {
      path: "",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      path: "/about-us",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      path: "/contact-us",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      path: "/reports",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: new URL(route.path || "/", siteUrl).toString(),
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...publishedReports.map((report) => ({
      url: new URL(`/reports/${report.slug}`, siteUrl).toString(),
      lastModified: report.publishedAt
        ? new Date(report.publishedAt)
        : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
