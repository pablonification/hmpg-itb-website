import type {
  PageContent,
  PageContentKey,
  ReportRecord,
  SiteSettings,
} from "@/lib/data/types";

import {
  getFieldsFromSections,
  getSocialFieldName,
  pageContentSections,
  reportEditorSections,
  siteSettingsSections,
} from "@/lib/cms/config";

function parseMultiline(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readText(
  formData: FormData,
  key: string,
  fallback: string,
  multiline = false,
) {
  const value = formData.get(key);

  if (value === null) {
    return fallback;
  }

  const normalized = String(value);

  if (!multiline) {
    return normalized;
  }

  return normalized;
}

function applyFieldSections<T extends object>(
  sections: readonly { fields: readonly { key: string; kind: string }[] }[],
  formData: FormData,
  currentValue: T,
) {
  const nextValue = { ...currentValue } as T;
  const nextValueRecord = nextValue as Record<string, unknown>;
  const currentValueRecord = currentValue as Record<string, unknown>;

  for (const field of sections.flatMap((section) => section.fields)) {
    if (field.kind === "checkbox") {
      nextValueRecord[field.key] = formData.get(String(field.key)) === "on";
      continue;
    }

    if (field.kind === "multiline") {
      nextValueRecord[field.key] = parseMultiline(
        formData.get(String(field.key)),
      );
      continue;
    }

    nextValueRecord[field.key] = readText(
      formData,
      String(field.key),
      String(currentValueRecord[field.key] ?? ""),
      field.kind === "textarea",
    );
  }

  return nextValue;
}

export function buildSettingsFromForm(
  formData: FormData,
  currentValue: SiteSettings,
) {
  const nextSettings = applyFieldSections(
    siteSettingsSections,
    formData,
    currentValue,
  );

  nextSettings.socialLinks = currentValue.socialLinks.map((link) => ({
    ...link,
    label: readText(
      formData,
      getSocialFieldName(link.platform, "label"),
      link.label,
    ),
    href: readText(
      formData,
      getSocialFieldName(link.platform, "href"),
      link.href,
    ),
    handle: readText(
      formData,
      getSocialFieldName(link.platform, "handle"),
      link.handle,
    ),
  }));

  return nextSettings;
}

export function buildPageContentFromForm<Key extends PageContentKey>(
  key: Key,
  formData: FormData,
  currentValue: PageContent<Key>,
) {
  switch (key) {
    case "home":
      return applyFieldSections(
        pageContentSections.home,
        formData,
        currentValue,
      ) as unknown as PageContent<Key>;
    case "about":
      return applyFieldSections(
        pageContentSections.about,
        formData,
        currentValue,
      ) as unknown as PageContent<Key>;
    case "reports":
      return applyFieldSections(
        pageContentSections.reports,
        formData,
        currentValue,
      ) as unknown as PageContent<Key>;
    case "contact":
      return applyFieldSections(
        pageContentSections.contact,
        formData,
        currentValue,
      ) as unknown as PageContent<Key>;
    default:
      return currentValue;
  }
}

export function buildReportInputFromForm(
  formData: FormData,
  currentValue?: ReportRecord,
) {
  const id = String(formData.get("id") ?? "").trim();
  const hasFeaturedField = formData.has("featured");
  const hasStatusField = formData.has("status");

  return {
    ...(id ? { id } : {}),
    title: readText(formData, "title", currentValue?.title ?? ""),
    slug: readText(formData, "slug", currentValue?.slug ?? ""),
    excerpt: readText(formData, "excerpt", currentValue?.excerpt ?? "", true),
    category: readText(formData, "category", currentValue?.category ?? ""),
    categoryLabel: readText(
      formData,
      "categoryLabel",
      currentValue?.categoryLabel ?? "",
    ),
    coverImageSrc: readText(
      formData,
      "coverImageSrc",
      currentValue?.coverImageSrc ?? "",
    ),
    publishedAt: readText(
      formData,
      "publishedAt",
      currentValue?.publishedAt ?? "",
    ),
    year: currentValue?.year ?? "",
    periodLabel: readText(
      formData,
      "periodLabel",
      currentValue?.periodLabel ?? "",
    ),
    editionLabel: readText(
      formData,
      "editionLabel",
      currentValue?.editionLabel ?? "",
    ),
    author: readText(formData, "author", currentValue?.author ?? ""),
    status: (hasStatusField
      ? String(formData.get("status") ?? "draft")
      : (currentValue?.status ?? "draft")) as ReportRecord["status"],
    featured: hasFeaturedField
      ? formData.get("featured") === "on"
      : (currentValue?.featured ?? false),
    relatedSlugs: currentValue?.relatedSlugs ?? [],
    bodyHtml: readText(
      formData,
      "bodyHtml",
      currentValue?.bodyHtml ?? "",
      true,
    ),
  };
}

export function getSeedCoverageSnapshot() {
  return {
    settings: getFieldsFromSections(siteSettingsSections).map((field) =>
      String(field.key),
    ),
    pages: {
      home: getFieldsFromSections(pageContentSections.home).map((field) =>
        String(field.key),
      ),
      about: getFieldsFromSections(pageContentSections.about).map((field) =>
        String(field.key),
      ),
      reports: getFieldsFromSections(pageContentSections.reports).map((field) =>
        String(field.key),
      ),
      contact: getFieldsFromSections(pageContentSections.contact).map((field) =>
        String(field.key),
      ),
    },
    reports: getFieldsFromSections(reportEditorSections).map((field) =>
      String(field.key),
    ),
  };
}
