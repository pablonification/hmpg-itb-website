import { createClient } from "@supabase/supabase-js";

import { getReportCategoryLabel } from "@/lib/cms/config";
import { seedStore } from "@/lib/data/seed";
import type {
  ActivityHighlight,
  CmsStore,
  PageContent,
  PageContentKey,
  PageContentMap,
  ReportFilters,
  ReportRecord,
  SiteSettings,
} from "@/lib/data/types";
import {
  compareReportsByPublishedAtDesc,
  getYearFromDateString,
  slugify,
  uniqueBy,
} from "@/lib/utils";

function cloneStore(): CmsStore {
  return JSON.parse(JSON.stringify(seedStore)) as CmsStore;
}

let demoStore = cloneStore();

type PageContentRow<Key extends PageContentKey = PageContentKey> = {
  key: Key;
  value: PageContent<Key>;
};

function fromSupabaseActivityRow(row: unknown): ActivityHighlight {
  const value = row as Record<string, unknown>;

  return {
    id: String(value.id),
    category: String(value.category),
    title: String(value.title),
    description: String(value.description),
    imageSrc: String(value.image_src),
    variant: String(value.variant) as ActivityHighlight["variant"],
    ...(typeof value.badge === "string" && value.badge.trim()
      ? { badge: value.badge }
      : {}),
  };
}

function fromSupabaseSettingsRow(row: unknown): SiteSettings {
  const value = row as Record<string, unknown>;

  return {
    organizationName: String(value.organization_name),
    shortName: String(value.short_name),
    tagline: String(value.tagline),
    logoSrc: String(value.logo_src),
    footerLogoSrc: String(value.footer_logo_src),
    addressLines: Array.isArray(value.address_lines)
      ? value.address_lines.map((item) => String(item))
      : [],
    footerAddressLines: Array.isArray(value.footer_address_lines)
      ? value.footer_address_lines.map((item) => String(item))
      : [],
    email: String(value.email),
    driveAkademikUrl: String(value.drive_akademik_url),
    footerCopyright: String(value.footer_copyright),
    socialLinks: Array.isArray(value.social_links)
      ? value.social_links.map((item) => {
          const link = item as Record<string, unknown>;

          return {
            platform: String(
              link.platform,
            ) as SiteSettings["socialLinks"][number]["platform"],
            label: String(link.label),
            href: String(link.href),
            handle: String(link.handle),
          };
        })
      : [],
  };
}

function getPageContentValue<Key extends PageContentKey>(
  rows: PageContentRow[] | null,
  key: Key,
  fallback: PageContent<Key>,
): PageContent<Key> {
  if (!rows) {
    return fallback;
  }

  const match = rows.find(
    (entry): entry is PageContentRow<Key> => entry.key === key,
  );

  if (!match?.value) {
    return fallback;
  }

  return {
    ...fallback,
    ...match.value,
  };
}

function buildReportRecord(
  base: Omit<ReportRecord, "cardImageSrc" | "coverCaption" | "summaryLabel">,
  optional: {
    summaryLabel: string | undefined;
  },
): ReportRecord {
  return {
    ...base,
    ...(optional.summaryLabel ? { summaryLabel: optional.summaryLabel } : {}),
  };
}

function getNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function getPublishedAtValue(
  nextStatus: ReportRecord["status"],
  incomingValue: string | undefined,
  existingValue: string | undefined,
) {
  const normalizedIncoming = getNonEmptyString(incomingValue);
  const normalizedExisting = getNonEmptyString(existingValue);

  if (normalizedIncoming) {
    return normalizedIncoming;
  }

  if (normalizedExisting) {
    return normalizedExisting;
  }

  return nextStatus === "published" ? new Date().toISOString() : "";
}

function getDerivedYear(
  publishedAt: string,
  existingValue: string | undefined,
) {
  return getYearFromDateString(publishedAt) || existingValue || "";
}

function normalizeReportCategoryLabel(
  category: string,
  incomingValue: string | undefined,
  existingValue: string | undefined,
) {
  return (
    getNonEmptyString(incomingValue) ??
    getReportCategoryLabel(category) ??
    existingValue ??
    "Editorial"
  );
}

export function applyFeaturedState(
  reports: ReportRecord[],
  nextReport: ReportRecord,
) {
  return reports.map((entry) => {
    if (entry.id === nextReport.id) {
      return nextReport;
    }

    if (!nextReport.featured || entry.id === nextReport.id) {
      return entry;
    }

    return {
      ...entry,
      featured: false,
    };
  });
}

export function deriveReportSaveState(
  input: Partial<ReportRecord> & Pick<ReportRecord, "title">,
  existing?: ReportRecord,
) {
  const nextStatus = input.status ?? existing?.status ?? "draft";
  const publishedAt = getPublishedAtValue(
    nextStatus,
    input.publishedAt,
    existing?.publishedAt,
  );
  const category =
    getNonEmptyString(input.category) ?? existing?.category ?? "editorial";

  return {
    status: nextStatus,
    category,
    categoryLabel: normalizeReportCategoryLabel(
      category,
      input.categoryLabel,
      existing?.categoryLabel,
    ),
    slug: slugify(
      getNonEmptyString(input.slug) ?? existing?.slug ?? input.title,
    ),
    publishedAt,
    year: getDerivedYear(publishedAt, existing?.year),
    featured: nextStatus === "published" && Boolean(input.featured),
  };
}

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function getAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase admin environment variables are not configured.");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export function isDemoMode() {
  return process.env.CMS_FORCE_DEMO_MODE === "1" || !hasSupabaseConfig();
}

export async function getStore() {
  if (isDemoMode()) {
    return demoStore;
  }

  const supabase = getAdminSupabaseClient();
  const [settingsResult, pagesResult, activitiesResult, reportsResult] =
    await Promise.all([
      supabase.from("site_settings").select("*").single(),
      supabase.from("page_content").select("*"),
      supabase.from("activity_highlights").select("*").order("sort_order"),
      supabase
        .from("reports")
        .select("*")
        .order("published_at", { ascending: false }),
    ]);

  const settings = settingsResult.data
    ? {
        ...seedStore.settings,
        ...fromSupabaseSettingsRow(settingsResult.data),
      }
    : null;
  const pageRows = pagesResult.data as PageContentRow[] | null;
  const activities = ((activitiesResult.data as unknown[]) ?? []).map((row) =>
    fromSupabaseActivityRow(row),
  );
  const reports = ((reportsResult.data as unknown[]) ?? []).map((row) =>
    fromSupabaseReportRow(row),
  );
  const pages: PageContentMap = {
    home: getPageContentValue(pageRows, "home", seedStore.pages.home),
    about: getPageContentValue(pageRows, "about", seedStore.pages.about),
    reports: getPageContentValue(pageRows, "reports", seedStore.pages.reports),
    contact: getPageContentValue(pageRows, "contact", seedStore.pages.contact),
  };

  return {
    settings: settings ?? seedStore.settings,
    pages,
    activities: activities.length > 0 ? activities : seedStore.activities,
    reports: reports.length > 0 ? reports : seedStore.reports,
  } satisfies CmsStore;
}

function fromSupabaseReportRow(row: unknown): ReportRecord {
  const value = row as Record<string, unknown>;

  return buildReportRecord(
    {
      id: String(value.id),
      slug: String(value.slug),
      title: String(value.title),
      excerpt: String(value.excerpt),
      category: String(value.category),
      categoryLabel: String(value.category_label),
      coverImageSrc: getNonEmptyString(value.cover_image_src) ?? "",
      publishedAt: getNonEmptyString(value.published_at) ?? "",
      year: getNonEmptyString(value.year) ?? "",
      periodLabel: getNonEmptyString(value.period_label) ?? "",
      editionLabel: getNonEmptyString(value.edition_label) ?? "",
      author: getNonEmptyString(value.author) ?? "",
      status: (value.status as ReportRecord["status"]) ?? "draft",
      featured: Boolean(value.featured),
      bodyHtml: String(value.body_html),
      relatedSlugs: Array.isArray(value.related_slugs)
        ? value.related_slugs.map((item) => String(item))
        : [],
    },
    {
      summaryLabel:
        typeof value.summary_label === "string"
          ? value.summary_label
          : undefined,
    },
  );
}

export async function getPublishedReports(filters: ReportFilters = {}) {
  const store = await getStore();

  return filterReports(
    store.reports.filter((report) => report.status === "published"),
    filters,
  );
}

export function filterReports(reports: ReportRecord[], filters: ReportFilters) {
  return reports.filter((report) => {
    if (
      filters.year &&
      filters.year !== "all" &&
      report.year !== filters.year
    ) {
      return false;
    }

    if (
      filters.period &&
      filters.period !== "all" &&
      report.periodLabel !== filters.period &&
      report.editionLabel !== filters.period
    ) {
      return false;
    }

    if (
      filters.category &&
      filters.category !== "all" &&
      report.category !== filters.category
    ) {
      return false;
    }

    if (
      filters.status &&
      filters.status !== "all" &&
      report.status !== filters.status
    ) {
      return false;
    }

    if (filters.query) {
      const normalizedQuery = filters.query.toLowerCase();
      const haystack = [
        report.title,
        report.excerpt,
        report.categoryLabel,
        report.editionLabel,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    }

    return true;
  });
}

export async function getReportBySlug(slug: string) {
  const store = await getStore();
  return (
    store.reports.find(
      (report) => report.slug === slug && report.status === "published",
    ) ?? null
  );
}

export async function getDashboardReportBySlug(slug: string) {
  const store = await getStore();
  return store.reports.find((report) => report.slug === slug) ?? null;
}

export function resolveFeaturedReport(reports: ReportRecord[]) {
  const publishedReports = reports
    .filter((report) => report.status === "published")
    .sort(compareReportsByPublishedAtDesc);

  return (
    publishedReports.find((report) => report.featured) ??
    publishedReports[0] ??
    null
  );
}

export function getAutoRelatedReportsFromReports(
  reports: ReportRecord[],
  slug: string,
) {
  const report = reports.find(
    (entry) => entry.slug === slug && entry.status === "published",
  );

  if (!report) {
    return [];
  }

  const sameCategory = reports
    .filter(
      (entry) =>
        entry.slug !== slug &&
        entry.status === "published" &&
        entry.category === report.category,
    )
    .sort(compareReportsByPublishedAtDesc);
  const fallback = reports
    .filter(
      (entry) =>
        entry.slug !== slug &&
        entry.status === "published" &&
        entry.category !== report.category,
    )
    .sort(compareReportsByPublishedAtDesc);

  return uniqueBy([...sameCategory, ...fallback], (entry) => entry.id).slice(
    0,
    3,
  );
}

export async function getRelatedReports(slug: string) {
  const store = await getStore();
  return getAutoRelatedReportsFromReports(store.reports, slug);
}

export async function saveSettings(nextSettings: SiteSettings) {
  if (isDemoMode()) {
    demoStore = { ...demoStore, settings: nextSettings };
    return nextSettings;
  }

  const supabase = getAdminSupabaseClient();
  const phoneProbe = await supabase
    .from("site_settings")
    .select("phone")
    .eq("id", 1)
    .maybeSingle();
  const result = await supabase
    .from("site_settings")
    .upsert({
      id: 1,
      organization_name: nextSettings.organizationName,
      short_name: nextSettings.shortName,
      tagline: nextSettings.tagline,
      logo_src: nextSettings.logoSrc,
      footer_logo_src: nextSettings.footerLogoSrc,
      address_lines: nextSettings.addressLines,
      footer_address_lines: nextSettings.footerAddressLines,
      email: nextSettings.email,
      drive_akademik_url: nextSettings.driveAkademikUrl,
      footer_copyright: nextSettings.footerCopyright,
      social_links: nextSettings.socialLinks,
      ...(!phoneProbe.error
        ? {
            phone:
              phoneProbe.data && typeof phoneProbe.data.phone === "string"
                ? phoneProbe.data.phone
                : "",
          }
        : {}),
    })
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return fromSupabaseSettingsRow(result.data);
}

export async function savePageContent<Key extends PageContentKey>(
  key: Key,
  value: PageContent<Key>,
) {
  if (isDemoMode()) {
    demoStore = {
      ...demoStore,
      pages: {
        ...demoStore.pages,
        [key]: value,
      },
    };

    return value;
  }

  const supabase = getAdminSupabaseClient();
  const result = await supabase
    .from("page_content")
    .upsert({ key, value }, { onConflict: "key" })
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return result.data.value as PageContent<Key>;
}

export async function saveActivities(activities: ActivityHighlight[]) {
  if (isDemoMode()) {
    demoStore = { ...demoStore, activities };
    return activities;
  }

  const supabase = getAdminSupabaseClient();
  const rows = activities.map((activity, index) => ({
    id: activity.id,
    badge: activity.badge ?? null,
    category: activity.category,
    title: activity.title,
    description: activity.description,
    image_src: activity.imageSrc,
    variant: activity.variant,
    sort_order: index,
  }));
  const result = await supabase
    .from("activity_highlights")
    .upsert(rows, { onConflict: "id" })
    .select("*");

  if (result.error) {
    throw result.error;
  }

  return ((result.data as unknown[]) ?? []).map((row) =>
    fromSupabaseActivityRow(row),
  );
}

export async function saveReport(
  input: Partial<ReportRecord> & Pick<ReportRecord, "title">,
) {
  const store = await getStore();
  const existing = input.id
    ? store.reports.find((report) => report.id === input.id)
    : undefined;
  const nextState = deriveReportSaveState(input, existing);

  const report = buildReportRecord(
    {
      id: existing?.id ?? `report-${Date.now()}`,
      slug: nextState.slug,
      title: input.title,
      excerpt: input.excerpt ?? existing?.excerpt ?? "",
      category: nextState.category,
      categoryLabel: nextState.categoryLabel,
      coverImageSrc:
        getNonEmptyString(input.coverImageSrc) ?? existing?.coverImageSrc ?? "",
      publishedAt: nextState.publishedAt,
      year: nextState.year,
      periodLabel:
        getNonEmptyString(input.periodLabel) ??
        existing?.periodLabel ??
        "Periode Aktif",
      editionLabel:
        getNonEmptyString(input.editionLabel) ??
        existing?.editionLabel ??
        "HMPG Report",
      author: getNonEmptyString(input.author) ?? existing?.author ?? "HMPG ITB",
      status: nextState.status,
      featured: nextState.featured,
      bodyHtml:
        input.bodyHtml ??
        existing?.bodyHtml ??
        "<section><h2>Draft</h2><p>Isi laporan.</p></section>",
      relatedSlugs: existing?.relatedSlugs ?? [],
    },
    {
      summaryLabel:
        getNonEmptyString(input.summaryLabel) ?? existing?.summaryLabel,
    },
  );

  if (isDemoMode()) {
    const nextReports = applyFeaturedState(
      [
        ...demoStore.reports.filter((entry) => entry.id !== report.id),
        report,
      ].sort(compareReportsByPublishedAtDesc),
      report,
    );

    demoStore = {
      ...demoStore,
      reports: nextReports,
    };

    return report;
  }

  const supabase = getAdminSupabaseClient();
  const result = await supabase
    .from("reports")
    .upsert(
      {
        id: report.id,
        slug: report.slug,
        title: report.title,
        excerpt: report.excerpt,
        category: report.category,
        category_label: report.categoryLabel,
        cover_image_src: report.coverImageSrc,
        published_at: report.publishedAt,
        year: report.year,
        period_label: report.periodLabel,
        edition_label: report.editionLabel,
        author: report.author,
        status: report.status,
        featured: report.featured,
        summary_label: report.summaryLabel,
        body_html: report.bodyHtml,
        related_slugs: report.relatedSlugs,
      },
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  if (report.featured) {
    const clearResult = await supabase
      .from("reports")
      .update({ featured: false })
      .neq("id", report.id)
      .eq("featured", true);

    if (clearResult.error) {
      throw clearResult.error;
    }
  }

  return fromSupabaseReportRow(result.data);
}

export async function deleteReport(id: string) {
  if (isDemoMode()) {
    demoStore = {
      ...demoStore,
      reports: demoStore.reports.filter((report) => report.id !== id),
    };

    return;
  }

  const supabase = getAdminSupabaseClient();
  const result = await supabase.from("reports").delete().eq("id", id);

  if (result.error) {
    throw result.error;
  }
}

export async function uploadAsset(file: File, folder: string) {
  const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;

  if (isDemoMode()) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  const supabase = getAdminSupabaseClient();
  const path = `${folder}/${safeName}`;
  const uploadResult = await supabase.storage
    .from(folder.startsWith("report") ? "report-media" : "site-assets")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadResult.error) {
    throw uploadResult.error;
  }

  const publicUrl = supabase.storage
    .from(folder.startsWith("report") ? "report-media" : "site-assets")
    .getPublicUrl(path);

  return publicUrl.data.publicUrl;
}
