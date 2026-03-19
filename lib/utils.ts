import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ReportRecord } from "@/lib/data/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDisplayDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function uniqueBy<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function extractFirstImageSrcFromHtml(html: string) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match?.[1] ?? "";
}

export function getReportPreviewImage(
  report: Pick<ReportRecord, "coverImageSrc" | "bodyHtml">,
) {
  return report.coverImageSrc || extractFirstImageSrcFromHtml(report.bodyHtml);
}

export function getYearFromDateString(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return String(date.getFullYear());
}

export function compareReportsByPublishedAtDesc(
  left: Pick<ReportRecord, "publishedAt">,
  right: Pick<ReportRecord, "publishedAt">,
) {
  return (
    new Date(right.publishedAt || 0).getTime() -
    new Date(left.publishedAt || 0).getTime()
  );
}
