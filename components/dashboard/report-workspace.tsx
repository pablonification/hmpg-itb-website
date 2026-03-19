"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Plus,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";

import type { ReportRecord } from "@/lib/data/types";
import { reportCategoryOptions } from "@/lib/cms/config";
import { cn } from "@/lib/utils";

import {
  DashboardBadge,
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/dashboard-primitives";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";
import { Button } from "@/components/ui/button";

const draftBodyFallback =
  "<section><h2>Ringkasan</h2><p>Mulai tulis laporan di sini.</p></section>";

function FilePickerField({
  defaultLabel,
  inputName,
  helperText,
}: {
  defaultLabel: string;
  inputName: string;
  helperText: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState(defaultLabel);

  return (
    <div className="space-y-2">
      <span className="text-brand-ink text-sm font-semibold">
        Preview image
      </span>
      <input
        className="hidden"
        name={inputName}
        onChange={(event) =>
          setFileName(event.target.files?.[0]?.name ?? defaultLabel)
        }
        ref={inputRef}
        type="file"
      />
      <div className="border-brand-sand/80 rounded-[1rem] border bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => inputRef.current?.click()}
            size="sm"
            type="button"
            variant="secondary"
          >
            <Upload />
            Pilih file
          </Button>
          <span className="text-brand-body text-sm">{fileName}</span>
        </div>
      </div>
      <p className="text-brand-body text-xs leading-6">{helperText}</p>
    </div>
  );
}

export function ReportWorkspace({
  currentQuery,
  reports,
  selectedReport,
  isAdmin,
  isCreatingNew,
  isViewingSelectedReport,
  message,
  saveAction,
  deleteAction,
  totalReports,
}: {
  currentQuery: string;
  reports: ReportRecord[];
  selectedReport: ReportRecord | undefined;
  isAdmin: boolean;
  isCreatingNew: boolean;
  isViewingSelectedReport: boolean;
  message?: string | null;
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  totalReports: number;
}) {
  const [query, setQuery] = useState(currentQuery);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (!isDirty) {
        return;
      }

      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const link = target.closest("a[href]");
      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) {
        return;
      }

      if (window.confirm("Perubahan belum disimpan. Tinggalkan editor?")) {
        return;
      }

      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isDirty]);

  const defaultCategory =
    selectedReport?.category ?? reportCategoryOptions[0]?.value;
  const previewHref = selectedReport
    ? `/dashboard/reports/preview/${selectedReport.slug}`
    : undefined;
  const isMobileEditorOpen = isCreatingNew || isViewingSelectedReport;

  function buildReportsHref({
    report,
    createNew,
  }: {
    report?: string;
    createNew?: boolean;
  }) {
    const params = new URLSearchParams();

    if (currentQuery) {
      params.set("query", currentQuery);
    }

    if (report) {
      params.set("report", report);
    }

    if (createNew) {
      params.set("new", "1");
    }

    const queryString = params.toString();
    return queryString
      ? `/dashboard/reports?${queryString}`
      : "/dashboard/reports";
  }

  return (
    <div className="space-y-5">
      <DashboardPageHeader
        actions={
          <a href={buildReportsHref({ createNew: true })}>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Laporan Baru
            </Button>
          </a>
        }
        description="Kelola laporan, preview, dan status publikasi dari satu halaman. Field administratif lanjutan tersedia untuk admin."
        eyebrow="Reports"
        title="Manajemen laporan"
      />

      {message ? (
        <div className="border-brand-sand/70 rounded-[1.5rem] border bg-[#eef8ef] px-4 py-3 text-sm font-medium text-[#1f5d33]">
          {message}
        </div>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <DashboardPanel
          className={cn(
            "flex flex-col xl:sticky xl:top-8 xl:h-[calc(100vh-4rem)] xl:self-start",
            isMobileEditorOpen ? "hidden xl:flex" : "",
          )}
        >
          <DashboardPanelHeader
            description="Pilih laporan untuk membuka editor."
            title="Daftar laporan"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-brand-body text-sm leading-6">
              {totalReports} laporan tersedia
            </p>
            <DashboardBadge tone="muted">{totalReports} laporan</DashboardBadge>
          </div>
          <form action="/dashboard/reports" className="mt-5 space-y-3">
            <label className="border-brand-sand/80 bg-brand-surface flex items-center gap-3 rounded-[1.2rem] border px-4 py-3">
              <Search className="text-brand-body h-4 w-4" />
              <input
                className="text-brand-ink placeholder:text-brand-body w-full bg-transparent text-sm outline-none"
                name="query"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul atau kategori..."
                type="search"
                value={query}
              />
            </label>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full justify-center"
                size="sm"
                type="submit"
                variant="secondary"
              >
                Cari
              </Button>
              {currentQuery ? (
                <a href="/dashboard/reports">
                  <Button
                    className="w-full justify-center"
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    Reset
                  </Button>
                </a>
              ) : null}
            </div>
          </form>

          <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {reports.length > 0 ? (
              reports.map((report) => {
                const isActive = report.id === selectedReport?.id;

                return (
                  <a
                    className={cn(
                      "border-brand-sand/70 block rounded-[1.4rem] border p-4 transition",
                      isActive
                        ? "border-brand-maroon bg-brand-shell shadow-[0_16px_30px_rgba(76,41,18,0.08)]"
                        : "hover:border-brand-maroon/30 hover:bg-brand-surface bg-white",
                    )}
                    href={buildReportsHref({ report: report.slug })}
                    key={report.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <DashboardBadge
                        tone={
                          report.status === "published" ? "success" : "warning"
                        }
                      >
                        {report.status}
                      </DashboardBadge>
                      {report.featured ? (
                        <DashboardBadge tone="accent">featured</DashboardBadge>
                      ) : null}
                    </div>
                    <h3 className="font-epilogue text-brand-ink mt-4 text-lg leading-tight font-bold">
                      {report.title}
                    </h3>
                    <p className="text-brand-body mt-2 text-sm leading-6">
                      {report.categoryLabel}
                    </p>
                  </a>
                );
              })
            ) : (
              <DashboardEmptyState
                description="Coba kata kunci lain atau buat laporan baru."
                title="Tidak ada laporan yang cocok"
              />
            )}
          </div>
        </DashboardPanel>

        <div
          className={cn(
            "space-y-5",
            !isMobileEditorOpen && selectedReport ? "hidden xl:block" : "",
          )}
        >
          {selectedReport || isCreatingNew ? (
            <>
              <div className="xl:hidden">
                <a href={buildReportsHref({})}>
                  <Button size="sm" variant="secondary">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke daftar
                  </Button>
                </a>
              </div>

              <form
                action={saveAction}
                className="space-y-5"
                onChange={() => setIsDirty(true)}
                onSubmit={() => {
                  setIsSubmitting(true);
                  setIsDirty(false);
                }}
              >
                <input
                  name="id"
                  type="hidden"
                  value={selectedReport?.id ?? ""}
                />
                <input name="returnQuery" type="hidden" value={currentQuery} />

                <DashboardPanel>
                  <DashboardPanelHeader
                    actions={
                      <div className="flex flex-wrap items-center gap-2">
                        <DashboardBadge tone={isDirty ? "warning" : "muted"}>
                          {isDirty ? "unsaved changes" : "all changes saved"}
                        </DashboardBadge>
                        {selectedReport?.featured ? (
                          <DashboardBadge tone="accent">
                            featured report
                          </DashboardBadge>
                        ) : null}
                      </div>
                    }
                    description="Field inti untuk penulis. Isi yang penting dulu, sisanya biarkan sistem membantu."
                    title={
                      selectedReport ? "Edit laporan" : "Buat laporan baru"
                    }
                  />

                  <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div className="space-y-5">
                      <FieldBlock
                        label="Judul laporan"
                        name="title"
                        placeholder="Contoh: Evaluasi Program Kerja Semester Genap"
                        required
                        value={selectedReport?.title ?? ""}
                      />

                      <TextAreaBlock
                        label="Ringkasan singkat"
                        name="excerpt"
                        placeholder="Tulis ringkasan pendek yang akan muncul di halaman daftar laporan."
                        rows={5}
                        value={selectedReport?.excerpt ?? ""}
                      />

                      <label className="block space-y-2">
                        <span className="text-brand-ink text-sm font-semibold">
                          Kategori
                        </span>
                        <select
                          className="border-brand-sand/80 focus:border-brand-maroon h-12 w-full rounded-[1rem] border bg-white px-4 text-sm outline-none"
                          defaultValue={defaultCategory}
                          name="category"
                        >
                          {reportCategoryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-brand-body text-xs leading-6">
                          Pilih kategori utama. Related report akan dipilih
                          otomatis berdasarkan kategori ini.
                        </p>
                      </label>
                    </div>

                    <div className="space-y-5">
                      <DashboardPanel className="border-brand-sand/60 bg-brand-surface p-4">
                        <div className="overflow-hidden rounded-[1.2rem] bg-white">
                          {selectedReport?.coverImageSrc ? (
                            <img
                              alt={`${selectedReport.title} cover preview`}
                              className="h-52 w-full object-cover"
                              src={selectedReport.coverImageSrc}
                            />
                          ) : (
                            <div className="text-brand-body flex h-52 items-center justify-center px-6 text-center text-sm">
                              Upload preview image untuk daftar dan halaman
                              laporan.
                            </div>
                          )}
                        </div>
                        <div className="mt-4 space-y-2">
                          <FilePickerField
                            defaultLabel="Belum ada file dipilih"
                            helperText="Upload file baru jika ingin mengganti gambar card. Related report dan daftar publik akan memakai gambar ini."
                            inputName="coverImageFile"
                          />
                          {!isAdmin ? (
                            <input
                              name="coverImageSrc"
                              type="hidden"
                              value={selectedReport?.coverImageSrc ?? ""}
                            />
                          ) : null}
                        </div>
                      </DashboardPanel>

                      <label className="block space-y-2">
                        <span className="text-brand-ink text-sm font-semibold">
                          Status publikasi
                        </span>
                        <select
                          className="border-brand-sand/80 focus:border-brand-maroon h-12 w-full rounded-[1rem] border bg-white px-4 text-sm outline-none"
                          defaultValue={selectedReport?.status ?? "draft"}
                          name="status"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </label>

                      <label className="border-brand-sand/80 bg-brand-surface flex items-start gap-3 rounded-[1rem] border px-4 py-3 text-sm leading-6">
                        <input
                          className="mt-1"
                          defaultChecked={selectedReport?.featured}
                          name="featured"
                          type="checkbox"
                        />
                        <span>
                          <strong className="text-brand-ink block">
                            Featured report
                          </strong>
                          Tandai satu laporan untuk menjadi highlight utama di
                          halaman reports.
                        </span>
                      </label>
                    </div>
                  </div>
                </DashboardPanel>

                <DashboardPanel>
                  <DashboardPanelHeader
                    description="Tulis isi laporan. Gambar inline dapat ditambahkan langsung dari toolbar."
                    title="Isi laporan"
                  />
                  <div className="mt-5">
                    <RichTextEditor
                      initialValue={
                        selectedReport?.bodyHtml ?? draftBodyFallback
                      }
                      name="bodyHtml"
                      onDirty={() => setIsDirty(true)}
                    />
                  </div>
                </DashboardPanel>

                {isAdmin ? (
                  <DashboardPanel>
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                        <div>
                          <h3 className="font-epilogue text-brand-ink text-xl font-bold">
                            Advanced
                          </h3>
                          <p className="text-brand-body mt-2 text-sm leading-6">
                            Hanya untuk admin. Digunakan untuk override teknis
                            dan metadata tambahan.
                          </p>
                        </div>
                        <DashboardBadge tone="muted">admin only</DashboardBadge>
                      </summary>

                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <FieldBlock
                          label="Slug"
                          name="slug"
                          placeholder="otomatis dari judul"
                          value={selectedReport?.slug ?? ""}
                        />
                        <FieldBlock
                          label="Author"
                          name="author"
                          placeholder="HMPG ITB"
                          value={selectedReport?.author ?? ""}
                        />
                        <FieldBlock
                          label="Edition label"
                          name="editionLabel"
                          placeholder="HMPG Report"
                          value={selectedReport?.editionLabel ?? ""}
                        />
                        <FieldBlock
                          label="Period label"
                          name="periodLabel"
                          placeholder="Contoh: Maret 2026"
                          value={selectedReport?.periodLabel ?? ""}
                        />
                        <FieldBlock
                          label="Published at"
                          name="publishedAt"
                          type="datetime-local"
                          value={toDatetimeLocalValue(
                            selectedReport?.publishedAt,
                          )}
                        />
                        <FieldBlock
                          label="Preview image URL"
                          name="coverImageSrc"
                          placeholder="https://..."
                          value={selectedReport?.coverImageSrc ?? ""}
                        />
                      </div>
                    </details>
                  </DashboardPanel>
                ) : null}

                <div className="border-brand-sand/80 sticky bottom-4 z-20 rounded-[1.4rem] border bg-[rgba(255,255,255,0.96)] p-4 shadow-[0_18px_36px_rgba(76,41,18,0.12)] backdrop-blur">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                      {isDirty ? (
                        <AlertTriangle className="mt-0.5 h-5 w-5 text-[#b66a00]" />
                      ) : (
                        <Sparkles className="text-brand-maroon mt-0.5 h-5 w-5" />
                      )}
                      <div>
                        <p className="text-brand-ink text-sm font-semibold">
                          {isDirty
                            ? "Perubahan belum disimpan"
                            : "Siap disimpan"}
                        </p>
                        <p className="text-brand-body text-xs leading-6">
                          {selectedReport
                            ? "Gunakan Preview untuk memeriksa draft tanpa membuka halaman publik."
                            : "Simpan laporan terlebih dahulu untuk membuka preview privat."}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {previewHref ? (
                        <a href={previewHref} target="_blank">
                          <Button size="sm" type="button" variant="secondary">
                            Preview
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      ) : (
                        <Button
                          disabled
                          size="sm"
                          type="button"
                          variant="secondary"
                        >
                          Preview setelah simpan
                        </Button>
                      )}
                      <Button size="sm" type="submit">
                        {isSubmitting ? "Menyimpan..." : "Simpan Laporan"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {selectedReport ? (
                <form action={deleteAction} className="pb-2">
                  <input name="id" type="hidden" value={selectedReport.id} />
                  <input
                    name="returnQuery"
                    type="hidden"
                    value={currentQuery}
                  />
                  <Button type="submit" variant="outline">
                    Hapus Laporan
                  </Button>
                </form>
              ) : null}
            </>
          ) : (
            <DashboardEmptyState
              action={
                <a href={buildReportsHref({ createNew: true })}>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                    Buat laporan pertama
                  </Button>
                </a>
              }
              description="Pilih laporan dari daftar atau buat laporan baru untuk membuka editor."
              title="Belum ada laporan yang dipilih"
            />
          )}
        </div>
      </section>
    </div>
  );
}

function FieldBlock({
  label,
  name,
  value,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-brand-ink text-sm font-semibold">{label}</span>
      <input
        className="border-brand-sand/80 focus:border-brand-maroon h-12 w-full rounded-[1rem] border bg-white px-4 text-sm outline-none"
        defaultValue={value}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function TextAreaBlock({
  label,
  name,
  value,
  placeholder,
  rows,
}: {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  rows: number;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-brand-ink text-sm font-semibold">{label}</span>
      <textarea
        className="border-brand-sand/80 focus:border-brand-maroon min-h-32 w-full rounded-[1rem] border bg-white px-4 py-3 text-sm outline-none"
        defaultValue={value}
        name={name}
        placeholder={placeholder}
        rows={rows}
      />
    </label>
  );
}

function toDatetimeLocalValue(value: string | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}
