import Link from "next/link";

import { AdminShell } from "@/components/dashboard/admin-shell";
import {
  DashboardBadge,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/dashboard-primitives";
import { ScrollToTarget } from "@/components/dashboard/scroll-to-target";
import { Button } from "@/components/ui/button";
import {
  assetManagedPageFieldKeys,
  cmsSocialPlatforms,
  dashboardContentTabs,
  getSocialFieldName,
  pageContentSections,
  siteAssetSlots,
  siteSettingsSections,
  type CmsFieldDefinition,
} from "@/lib/cms/config";
import {
  saveAboutContentAction,
  saveContactContentAction,
  saveHomeContentAction,
  saveReportsContentAction,
  saveSettingsAction,
} from "@/lib/actions/admin";
import { requireAdminSession } from "@/lib/auth/session";
import { getStore } from "@/lib/repositories/content-repository";
import type { PageContentKey, SiteSettings } from "@/lib/data/types";

interface DashboardContentPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

type ContentSectionKey = (typeof dashboardContentTabs)[number]["key"];

export default async function DashboardContentPage({
  searchParams,
}: DashboardContentPageProps) {
  const session = await requireAdminSession();
  const store = await getStore();
  const params = await searchParams;
  const currentTab =
    typeof params.section === "string" &&
    dashboardContentTabs.some((tab) => tab.key === params.section)
      ? (params.section as ContentSectionKey)
      : "settings";
  const message = typeof params.message === "string" ? params.message : null;

  const mediaSlots =
    currentTab === "settings"
      ? []
      : siteAssetSlots.filter(
          (slot) => slot.targetType === "page" && slot.pageKey === currentTab,
        );

  return (
    <AdminShell pathname="/dashboard/content" session={session}>
      {message ? <ScrollToTarget targetId="content-save-feedback" /> : null}

      <DashboardPageHeader
        description="Kelola konten publik per halaman. Field visual dikelola terpisah di modul Assets."
        eyebrow="Content"
        title="Manajemen konten"
      />

      {message ? (
        <div
          className="border-brand-sand/70 rounded-[1.5rem] border bg-[#eef8ef] px-4 py-3 text-sm font-medium text-[#1f5d33]"
          id="content-save-feedback"
        >
          {message}
        </div>
      ) : null}

      <DashboardPanel>
        <DashboardPanelHeader
          description="Pilih halaman yang ingin diperbarui."
          title="Area Konten"
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {dashboardContentTabs.map((tab) => {
            const isActive = tab.key === currentTab;

            return (
              <a
                className={`rounded-[1.4rem] border px-4 py-4 transition ${
                  isActive
                    ? "border-brand-maroon bg-brand-shell"
                    : "border-brand-sand/70 hover:border-brand-maroon/30 bg-white"
                }`}
                href={`/dashboard/content?section=${tab.key}`}
                key={tab.key}
              >
                <p className="font-epilogue text-brand-ink text-lg font-bold">
                  {tab.label}
                </p>
                <p className="text-brand-body mt-2 text-sm leading-6">
                  {tab.description}
                </p>
              </a>
            );
          })}
        </div>
      </DashboardPanel>

      {currentTab === "settings" ? (
        <SettingsEditor
          settings={store.settings as SiteSettings & Record<string, unknown>}
        />
      ) : (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <PageContentEditor
            pageKey={currentTab}
            store={
              store.pages[currentTab] as unknown as Record<string, unknown>
            }
          />
          <DashboardPanel>
            <DashboardPanelHeader
              description="Asset visual utama dikelola terpisah agar form konten tetap ringkas."
              title="Asset Terkait"
            />
            <div className="mt-5 space-y-4">
              {mediaSlots.map((slot) => (
                <div
                  className="border-brand-sand/70 bg-brand-surface rounded-[1.4rem] border p-4"
                  key={slot.id}
                >
                  <p className="text-brand-ink text-sm font-semibold">
                    {slot.label}
                  </p>
                  <p className="text-brand-body mt-2 text-sm leading-6">
                    {slot.description}
                  </p>
                </div>
              ))}

              {currentTab === "reports" ? (
                <div className="border-brand-sand/70 bg-brand-surface rounded-[1.4rem] border p-4">
                  <p className="text-brand-ink text-sm font-semibold">
                    Featured report
                  </p>
                  <p className="text-brand-body mt-2 text-sm leading-6">
                    Featured report dipilih dari modul Reports, bukan dari slug
                    manual di pengaturan halaman.
                  </p>
                </div>
              ) : null}

              <Link href="/dashboard/assets">
                <Button
                  className="w-full justify-center"
                  size="sm"
                  variant="secondary"
                >
                  Buka Assets
                </Button>
              </Link>
            </div>
          </DashboardPanel>
        </section>
      )}
    </AdminShell>
  );
}

function SettingsEditor({
  settings,
}: {
  settings: SiteSettings & Record<string, unknown>;
}) {
  return (
    <DashboardPanel>
      <DashboardPanelHeader
        description="Kelola identitas singkat organisasi, kontak utama, footer, dan tautan sosial yang tampil di website publik."
        title="Global Settings"
      />
      <form action={saveSettingsAction} className="mt-5 space-y-8">
        {siteSettingsSections.map((section) => (
          <SectionFields
            fields={section.fields}
            key={section.title}
            title={section.title}
            value={settings}
          />
        ))}

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-epilogue text-brand-ink text-lg font-bold">
                Social Links
              </h3>
              <p className="text-brand-body mt-2 text-sm leading-6">
                Dipakai di footer dan halaman Contact Us.
              </p>
            </div>
            <DashboardBadge tone="muted">Public</DashboardBadge>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {cmsSocialPlatforms.map((platformDef) => {
              const currentLink = settings.socialLinks.find(
                (link) => link.platform === platformDef.platform,
              );

              if (!currentLink) {
                return null;
              }

              return (
                <div
                  className="border-brand-sand/70 bg-brand-surface rounded-[1.5rem] border p-4"
                  key={platformDef.platform}
                >
                  <p className="text-brand-ink text-sm font-semibold">
                    {platformDef.label}
                  </p>
                  <div className="mt-4 space-y-4">
                    <Field
                      label="Label"
                      name={getSocialFieldName(platformDef.platform, "label")}
                      value={currentLink.label}
                    />
                    <Field
                      label="URL"
                      name={getSocialFieldName(platformDef.platform, "href")}
                      value={currentLink.href}
                    />
                    <Field
                      label="Handle"
                      name={getSocialFieldName(platformDef.platform, "handle")}
                      value={currentLink.handle}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Button type="submit">Simpan perubahan</Button>
      </form>
    </DashboardPanel>
  );
}

function PageContentEditor({
  pageKey,
  store,
}: {
  pageKey: PageContentKey;
  store: Record<string, unknown>;
}) {
  const config = {
    home: {
      title: "Home Page",
      description:
        "Kelola copy hero, ringkasan utama, dan pengantar section reports di beranda.",
      action: saveHomeContentAction,
      sections: pageContentSections.home,
    },
    about: {
      title: "About Page",
      description:
        "Edit narasi organisasi, sejarah, dan identitas dengan fokus ke copy, bukan asset URL.",
      action: saveAboutContentAction,
      sections: pageContentSections.about,
    },
    reports: {
      title: "Reports Page",
      description:
        "Atur hero halaman reports dan CTA arsip tanpa perlu memilih featured report secara manual.",
      action: saveReportsContentAction,
      sections: pageContentSections.reports,
    },
    contact: {
      title: "Contact Page",
      description: "Kelola headline, alamat sekretariat, dan CTA kontak utama.",
      action: saveContactContentAction,
      sections: pageContentSections.contact,
    },
  }[pageKey];

  return (
    <DashboardPanel>
      <DashboardPanelHeader
        description={config.description}
        title={config.title}
      />
      <form action={config.action} className="mt-5 space-y-8">
        {config.sections.map((section) => (
          <SectionFields
            fields={filterContentFields(pageKey, section.fields)}
            key={section.title}
            title={section.title}
            value={store}
          />
        ))}
        <Button type="submit">Simpan perubahan</Button>
      </form>
    </DashboardPanel>
  );
}

function filterContentFields<T extends object>(
  pageKey: PageContentKey,
  fields: readonly CmsFieldDefinition<T>[],
) {
  const hiddenKeys = new Set<string>(assetManagedPageFieldKeys[pageKey] ?? []);

  return fields.filter((field) => !hiddenKeys.has(String(field.key)));
}

function SectionFields<T extends object>({
  title,
  fields,
  value,
}: {
  title: string;
  fields: readonly CmsFieldDefinition<T>[];
  value: Record<string, unknown>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-epilogue text-brand-ink text-lg font-bold">
        {title}
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <FieldByType field={field} key={String(field.key)} value={value} />
        ))}
      </div>
    </div>
  );
}

function FieldByType<T extends object>({
  field,
  value,
}: {
  field: CmsFieldDefinition<T>;
  value: Record<string, unknown>;
}) {
  const fieldValue = value[String(field.key)];

  if (field.kind === "multiline" || field.kind === "textarea") {
    return (
      <div className="md:col-span-2">
        <TextAreaField
          label={field.label}
          name={String(field.key)}
          value={
            Array.isArray(fieldValue)
              ? fieldValue.join("\n")
              : String(fieldValue ?? "")
          }
        />
      </div>
    );
  }

  return (
    <Field
      label={field.label}
      name={String(field.key)}
      value={String(fieldValue ?? "")}
    />
  );
}

function Field({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-brand-ink text-sm font-semibold">{label}</span>
      <input
        className="border-brand-sand/80 focus:border-brand-maroon h-12 w-full rounded-[1rem] border bg-white px-4 text-sm outline-none"
        defaultValue={value}
        name={name}
        type="text"
      />
    </label>
  );
}

function TextAreaField({
  label,
  name,
  value,
}: {
  label: string;
  name: string;
  value: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-brand-ink text-sm font-semibold">{label}</span>
      <textarea
        className="border-brand-sand/80 focus:border-brand-maroon min-h-32 w-full rounded-[1rem] border bg-white px-4 py-3 text-sm outline-none"
        defaultValue={value}
        name={name}
      />
    </label>
  );
}
