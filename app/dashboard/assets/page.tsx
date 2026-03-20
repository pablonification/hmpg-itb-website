import { AdminShell } from "@/components/dashboard/admin-shell";
import { AssetUploadCard } from "@/components/dashboard/asset-upload-card";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/dashboard-primitives";
import {
  restoreCmsAssetAction,
  uploadCmsAssetAction,
} from "@/lib/actions/admin";
import { requireAdminSession } from "@/lib/auth/session";
import { siteAssetSlots } from "@/lib/cms/config";
import { seedStore } from "@/lib/data/seed";
import { getStore } from "@/lib/repositories/content-repository";

interface DashboardAssetsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardAssetsPage({
  searchParams,
}: DashboardAssetsPageProps) {
  const session = await requireAdminSession();
  const store = await getStore();
  const params = await searchParams;
  const message = typeof params.message === "string" ? params.message : null;

  return (
    <AdminShell pathname="/dashboard/assets" session={session}>
      <DashboardPageHeader
        description="Kelola asset visual yang digunakan di situs publik."
        eyebrow="Assets"
        title="Manajemen asset"
      />

      {message ? (
        <div className="border-brand-sand/70 rounded-[1.5rem] border bg-[#eef8ef] px-4 py-3 text-sm font-medium text-[#1f5d33]">
          {message}
        </div>
      ) : null}

      <DashboardPanel>
        <DashboardPanelHeader
          description="Halaman ini hanya menampilkan asset yang digunakan oleh situs publik. Gambar inline laporan tetap dikelola dari editor laporan."
          title="Asset Brand dan Halaman"
        />
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {siteAssetSlots.map((slot) => {
            const currentSrc = getSiteAssetSrc(store, slot);
            const defaultSrc = getDefaultSiteAssetSrc(slot);

            return (
              <AssetUploadCard
                action={uploadCmsAssetAction}
                currentSrc={String(currentSrc ?? "")}
                defaultSrc={String(defaultSrc ?? "")}
                description={slot.description}
                folder={slot.folder}
                key={slot.id}
                label={slot.label}
                restoreAction={restoreCmsAssetAction}
                targetKey={slot.targetKey}
                targetType={slot.targetType}
                {...(slot.targetType === "page"
                  ? { pageKey: slot.pageKey }
                  : {})}
              />
            );
          })}
        </div>
      </DashboardPanel>
    </AdminShell>
  );
}

function getSiteAssetSrc(
  store: Awaited<ReturnType<typeof getStore>>,
  slot: (typeof siteAssetSlots)[number],
) {
  if (slot.targetType === "settings") {
    return store.settings[slot.targetKey];
  }

  switch (slot.pageKey) {
    case "home":
      return store.pages.home[slot.targetKey];
    case "about":
      return store.pages.about[slot.targetKey];
    case "reports":
      return store.pages.reports[slot.targetKey];
    case "contact":
      return store.pages.contact[slot.targetKey];
    default:
      return "";
  }
}

function getDefaultSiteAssetSrc(slot: (typeof siteAssetSlots)[number]) {
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
