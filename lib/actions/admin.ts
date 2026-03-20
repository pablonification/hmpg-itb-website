"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { siteAssetSlots } from "@/lib/cms/config";
import {
  clearAdminSession,
  createAdminSession,
  requireAdminSession,
  requireReportsSession,
} from "@/lib/auth/session";
import {
  buildPageContentFromForm,
  buildReportInputFromForm,
  buildSettingsFromForm,
} from "@/lib/cms/form-values";
import { seedStore } from "@/lib/data/seed";
import type { CmsUserRole } from "@/lib/data/types";
import type { ActivityHighlight } from "@/lib/data/types";
import {
  deleteReport,
  getStore,
  saveActivities,
  savePageContent,
  saveReport,
  saveSettings,
  uploadAsset,
} from "@/lib/repositories/content-repository";
import {
  createCmsUser,
  deleteCmsUser,
  updateCmsUserRole,
} from "@/lib/repositories/cms-user-repository";
import { sanitizeRichTextHtml } from "@/lib/utils";

function redirectToUsers(params: string) {
  redirect(`/dashboard/users${params}` as never);
}

function redirectToContent(section: string, message: string) {
  redirect(
    `/dashboard/content?section=${section}&message=${encodeURIComponent(message)}` as never,
  );
}

function redirectToAssets(message: string) {
  redirect(`/dashboard/assets?message=${encodeURIComponent(message)}` as never);
}

function redirectToReports(params: URLSearchParams) {
  redirect(`/dashboard/reports?${params.toString()}` as never);
}

type SiteAssetSlot = (typeof siteAssetSlots)[number];

function getSiteAssetSlot(formData: FormData) {
  const targetType = String(formData.get("targetType") ?? "");
  const targetKey = String(formData.get("targetKey") ?? "");
  const pageKey = String(formData.get("pageKey") ?? "");

  return siteAssetSlots.find((slot) =>
    slot.targetType === "settings"
      ? slot.targetType === targetType && slot.targetKey === targetKey
      : slot.targetType === targetType &&
        slot.pageKey === pageKey &&
        slot.targetKey === targetKey,
  );
}

function getDefaultSiteAssetSrc(slot: SiteAssetSlot) {
  if (slot.targetType === "settings") {
    return seedStore.settings[slot.targetKey];
  }

  switch (slot.pageKey) {
    case "home":
      return seedStore.pages.home[slot.targetKey];
    case "about":
      return seedStore.pages.about[slot.targetKey];
    case "reports":
      return seedStore.pages.reports[slot.targetKey];
    case "contact":
      return seedStore.pages.contact[slot.targetKey];
    default:
      return "";
  }
}

async function saveSiteAssetValue(
  slot: SiteAssetSlot,
  nextAssetSrc: string,
  store: Awaited<ReturnType<typeof getStore>>,
) {
  if (slot.targetType === "settings") {
    await saveSettings({
      ...store.settings,
      [slot.targetKey]: nextAssetSrc,
    });
    return;
  }

  await savePageContent(slot.pageKey, {
    ...store.pages[slot.pageKey],
    [slot.targetKey]: nextAssetSrc,
  });
}

function revalidateSiteAssetPaths(slot: SiteAssetSlot) {
  if (slot.targetType === "settings") {
    revalidatePath("/", "layout");
    revalidatePath("/contact-us");
    revalidatePath("/dashboard/assets");
    return;
  }

  const pathMap = {
    home: "/",
    about: "/about-us",
    reports: "/reports",
    contact: "/contact-us",
  } as const;

  revalidatePath(pathMap[slot.pageKey]);
  if (slot.pageKey === "reports") {
    revalidatePath("/");
  }
  revalidatePath("/dashboard/assets");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdminSession();
  const store = await getStore();
  const nextSettings = buildSettingsFromForm(formData, store.settings);

  await saveSettings(nextSettings);
  revalidatePath("/", "layout");
  revalidatePath("/contact-us");
  redirectToContent("settings", "Pengaturan berhasil disimpan.");
}

export async function saveHomeContentAction(formData: FormData) {
  await requireAdminSession();
  const store = await getStore();
  const nextHome = buildPageContentFromForm("home", formData, store.pages.home);

  await savePageContent("home", nextHome);
  revalidatePath("/");
  redirectToContent("home", "Konten halaman berhasil disimpan.");
}

export async function saveActivitiesAction(formData: FormData) {
  await requireAdminSession();
  const ids = formData.getAll("activityId");
  const categories = formData.getAll("activityCategory");
  const titles = formData.getAll("activityTitle");
  const descriptions = formData.getAll("activityDescription");
  const imageSrcs = formData.getAll("activityImageSrc");
  const variants = formData.getAll("activityVariant");
  const badges = formData.getAll("activityBadge");

  const activities: ActivityHighlight[] = ids.map((id, index) => {
    const badge = String(badges[index] ?? "").trim();

    return {
      id: String(id),
      category: String(categories[index] ?? ""),
      title: String(titles[index] ?? ""),
      description: String(descriptions[index] ?? ""),
      imageSrc: String(imageSrcs[index] ?? ""),
      variant: (variants[index] as ActivityHighlight["variant"]) ?? "feature",
      ...(badge ? { badge } : {}),
    };
  });

  await saveActivities(activities);
  revalidatePath("/");
}

export async function saveAboutContentAction(formData: FormData) {
  await requireAdminSession();
  const store = await getStore();
  const nextAbout = buildPageContentFromForm(
    "about",
    formData,
    store.pages.about,
  );

  await savePageContent("about", nextAbout);
  revalidatePath("/about-us");
  redirectToContent("about", "Konten halaman berhasil disimpan.");
}

export async function saveReportsContentAction(formData: FormData) {
  await requireAdminSession();
  const store = await getStore();
  const nextReports = buildPageContentFromForm(
    "reports",
    formData,
    store.pages.reports,
  );

  await savePageContent("reports", nextReports);
  revalidatePath("/reports");
  revalidatePath("/");
  redirectToContent("reports", "Konten halaman berhasil disimpan.");
}

export async function saveContactContentAction(formData: FormData) {
  await requireAdminSession();
  const store = await getStore();
  const nextContact = buildPageContentFromForm(
    "contact",
    formData,
    store.pages.contact,
  );

  await savePageContent("contact", nextContact);
  revalidatePath("/contact-us");
  redirectToContent("contact", "Konten halaman berhasil disimpan.");
}

export async function saveReportAction(formData: FormData) {
  try {
    const session = await requireReportsSession();
    const store = await getStore();
    const returnQuery = String(formData.get("returnQuery") ?? "").trim();
    const reportId = String(formData.get("id") ?? "").trim();
    const currentReport = reportId
      ? store.reports.find((report) => report.id === reportId)
      : undefined;
    const coverFile = formData.get("coverImageFile");
    let coverImageSrc = String(formData.get("coverImageSrc") ?? "");

    if (coverFile instanceof File && coverFile.size > 0) {
      coverImageSrc = await uploadAsset(coverFile, "report-media/previews");
    }

    const nextReport = buildReportInputFromForm(formData, currentReport);
    const nextSlug = nextReport.slug || currentReport?.slug;

    const savedReport = await saveReport({
      ...nextReport,
      ...(session.role === "admin" && nextSlug ? { slug: nextSlug } : {}),
      ...(session.role === "admin"
        ? { publishedAt: nextReport.publishedAt }
        : {}),
      coverImageSrc,
      bodyHtml: sanitizeRichTextHtml(nextReport.bodyHtml),
    });

    revalidatePath("/dashboard/reports");
    revalidatePath("/reports");
    revalidatePath("/");
    revalidatePath(`/reports/${savedReport.slug}`);
    revalidatePath(`/dashboard/reports/preview/${savedReport.slug}`);
    const searchParams = new URLSearchParams({
      report: savedReport.slug,
      message: "Laporan berhasil disimpan.",
    });

    if (returnQuery) {
      searchParams.set("query", returnQuery);
    }

    redirectToReports(searchParams);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const returnQuery = String(formData.get("returnQuery") ?? "").trim();
    const reportId = String(formData.get("id") ?? "").trim();
    const isCreatingNew = !reportId;
    const message =
      error instanceof Error ? error.message : "Gagal menyimpan laporan.";
    const searchParams = new URLSearchParams({
      error: message,
    });

    if (returnQuery) {
      searchParams.set("query", returnQuery);
    }

    if (isCreatingNew) {
      searchParams.set("new", "1");
    } else {
      const reportSlug = String(formData.get("slug") ?? "").trim();
      if (reportSlug) {
        searchParams.set("report", reportSlug);
      }
    }

    redirectToReports(searchParams);
  }
}

export async function deleteReportAction(formData: FormData) {
  await requireReportsSession();
  const returnQuery = String(formData.get("returnQuery") ?? "").trim();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteReport(id);
  revalidatePath("/dashboard/reports");
  revalidatePath("/reports");
  const searchParams = new URLSearchParams({
    message: "Laporan berhasil dihapus.",
  });

  if (returnQuery) {
    searchParams.set("query", returnQuery);
  }

  redirect(`/dashboard/reports?${searchParams.toString()}`);
}

export async function uploadCmsAssetAction(formData: FormData) {
  await requireAdminSession();
  const file = formData.get("assetFile");
  if (!(file instanceof File) || file.size === 0) return;

  const folder = String(formData.get("folder") ?? "site-assets");
  const nextAssetSrc = await uploadAsset(file, folder);
  const store = await getStore();
  const slot = getSiteAssetSlot(formData);

  if (!slot) {
    return;
  }

  await saveSiteAssetValue(slot, nextAssetSrc, store);
  revalidateSiteAssetPaths(slot);
  redirectToAssets("Asset berhasil diperbarui.");
}

export async function restoreCmsAssetAction(formData: FormData) {
  await requireAdminSession();
  const store = await getStore();
  const slot = getSiteAssetSlot(formData);

  if (!slot) {
    return;
  }

  await saveSiteAssetValue(slot, getDefaultSiteAssetSrc(slot), store);
  revalidateSiteAssetPaths(slot);
  redirectToAssets("Asset default berhasil dipulihkan.");
}

export async function uploadLogoAction(formData: FormData) {
  await requireAdminSession();
  const file = formData.get("logoFile");
  if (!(file instanceof File) || file.size === 0) return;

  const nextLogoSrc = await uploadAsset(file, "site-assets");
  const store = await getStore();

  await saveSettings({
    ...store.settings,
    logoSrc: nextLogoSrc,
    footerLogoSrc: nextLogoSrc,
  });
  revalidatePath("/", "layout");
}

export async function createCmsUserAction(formData: FormData) {
  await requireAdminSession();

  try {
    await createCmsUser({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      role: String(formData.get("role") ?? "writer") as CmsUserRole,
    });
    revalidatePath("/dashboard/users");
    redirectToUsers("?message=User%20baru%20berhasil%20dibuat.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Gagal membuat user CMS.";
    redirectToUsers(`?error=${encodeURIComponent(message)}`);
  }
}

export async function updateCmsUserRoleAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "writer") as CmsUserRole;

  if (!id) {
    redirectToUsers("?error=User%20tidak%20ditemukan.");
  }

  try {
    const updatedUser = await updateCmsUserRole(id, role);
    if (!updatedUser) {
      redirectToUsers("?error=User%20tidak%20ditemukan.");
      return;
    }

    if (
      updatedUser.id === session.userId &&
      updatedUser.role !== session.role
    ) {
      await createAdminSession(
        session.userId,
        session.email,
        updatedUser.role,
        session.mode,
      );
    }

    revalidatePath("/dashboard/users");
    redirectToUsers("?message=Role%20user%20berhasil%20diubah.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Gagal memperbarui role user.";
    redirectToUsers(`?error=${encodeURIComponent(message)}`);
  }
}

export async function deleteCmsUserAction(formData: FormData) {
  const session = await requireAdminSession();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirectToUsers("?error=User%20tidak%20ditemukan.");
  }

  try {
    await deleteCmsUser(id);
    revalidatePath("/dashboard/users");

    if (id === session.userId) {
      await clearAdminSession();
      redirect("/dashboard/login?message=Akun%20Anda%20telah%20dihapus.");
    }

    redirectToUsers("?message=User%20berhasil%20dihapus.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Gagal menghapus user CMS.";
    redirectToUsers(`?error=${encodeURIComponent(message)}`);
  }
}
