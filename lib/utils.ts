import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ReportRecord, ReportStatus } from "@/lib/data/types";

export const CMS_UPLOAD_SIZE_LIMIT_BYTES = 3 * 1024 * 1024;
export const CMS_UPLOAD_SIZE_LIMIT_LABEL = "3 MB";

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

export function formatReportStatusLabel(status: ReportStatus) {
  return status === "published" ? "Published" : "Draft";
}

export function normalizeRichTextHref(href: string) {
  const normalizedHref = href.trim();

  if (!normalizedHref) {
    return "";
  }

  if (
    normalizedHref.startsWith("/") ||
    normalizedHref.startsWith("#") ||
    normalizedHref.startsWith("//")
  ) {
    return normalizedHref;
  }

  if (/^(https?:\/\/|mailto:|tel:)/i.test(normalizedHref)) {
    return normalizedHref;
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(normalizedHref)) {
    return normalizedHref;
  }

  return `https://${normalizedHref}`;
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

export function sanitizeRichTextHtml(html: string) {
  return html
    .replace(
      /<(script|style|iframe|object|embed|form|input|button|textarea|select|option|link|meta)[^>]*>[\s\S]*?<\/\1>/gi,
      "",
    )
    .replace(
      /<(script|style|iframe|object|embed|form|input|button|textarea|select|option|link|meta)\b[^>]*\/?>/gi,
      "",
    )
    .replace(/\s+on[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/\s+style\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/\s+srcdoc\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(
      /\s+(href|src)\s*=\s*(['"])\s*(javascript:|data:text\/html)[\s\S]*?\2/gi,
      "",
    )
    .replace(/\s+(href|src)\s*=\s*(javascript:|data:text\/html)[^\s>]*/gi, "")
    .replace(
      /\s+href\s*=\s*(["'])(.*?)\1/gi,
      (_, quote: string, href: string) => {
        const normalizedHref = normalizeRichTextHref(href);

        if (!normalizedHref) {
          return "";
        }

        return ` href=${quote}${normalizedHref}${quote}`;
      },
    )
    .replace(/\s+href\s*=\s*(?!["'])([^\s>]+)/gi, (_, href: string) => {
      const normalizedHref = normalizeRichTextHref(href);

      if (!normalizedHref) {
        return "";
      }

      return ` href="${normalizedHref}"`;
    });
}

export function getCmsImageUploadError(file: File) {
  if (!file.type.startsWith("image/")) {
    return "File harus berupa gambar.";
  }

  if (file.size > CMS_UPLOAD_SIZE_LIMIT_BYTES) {
    return `Ukuran file melebihi batas ${CMS_UPLOAD_SIZE_LIMIT_LABEL}.`;
  }

  return null;
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
