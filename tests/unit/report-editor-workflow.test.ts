import { seedReports } from "@/lib/data/seed";
import {
  applyFeaturedState,
  deriveReportSaveState,
  getAutoRelatedReportsFromReports,
  resolveFeaturedReport,
} from "@/lib/repositories/content-repository";

describe("report editor workflow helpers", () => {
  it("derives slug, published date, and year from guided report inputs", () => {
    const state = deriveReportSaveState({
      title: "Laporan Baru HMPG",
      status: "published",
      category: "editorial",
      featured: true,
    });

    expect(state.slug).toBe("laporan-baru-hmpg");
    expect(state.categoryLabel).toBe("Editorial");
    expect(state.featured).toBe(true);
    expect(state.publishedAt).toMatch(/^20\d\d-/);
    expect(state.year).toMatch(/^20\d\d$/);
  });

  it("preserves existing slug when the guided form omits admin-only overrides", () => {
    const existingReport = seedReports[0]!;
    const state = deriveReportSaveState(
      {
        title: "Judul Diubah Tanpa Override Slug",
        status: existingReport.status,
        category: existingReport.category,
      },
      existingReport,
    );

    expect(state.slug).toBe(existingReport.slug);
  });

  it("keeps only one featured report active at a time", () => {
    const target = {
      ...seedReports[1]!,
      featured: true,
      status: "published" as const,
    };
    const nextReports = applyFeaturedState(seedReports, target);

    expect(
      nextReports.find((report) => report.id === target.id)?.featured,
    ).toBe(true);
    expect(
      nextReports
        .filter((report) => report.featured)
        .map((report) => report.id),
    ).toEqual([target.id]);
  });

  it("picks related reports from the same published category before newer fallbacks", () => {
    const reports = [
      ...seedReports,
      {
        ...seedReports[2]!,
        id: "report-extra-1",
        slug: "pengmas-baru-1",
        category: seedReports[2]!.category,
        categoryLabel: seedReports[2]!.categoryLabel,
        publishedAt: "2026-02-10T00:00:00.000Z",
        status: "published" as const,
      },
      {
        ...seedReports[2]!,
        id: "report-extra-2",
        slug: "pengmas-baru-2",
        category: seedReports[2]!.category,
        categoryLabel: seedReports[2]!.categoryLabel,
        publishedAt: "2026-02-05T00:00:00.000Z",
        status: "published" as const,
      },
    ];

    const related = getAutoRelatedReportsFromReports(
      reports,
      "dokumentasi-desa-binaan-pemetaan-partisipatif",
    );

    expect(related).toHaveLength(3);
    expect(related[0]?.slug).toBe("pengmas-baru-1");
    expect(related[1]?.slug).toBe("pengmas-baru-2");
  });

  it("resolves the featured report from the report-level flag", () => {
    expect(resolveFeaturedReport(seedReports)?.slug).toBe(
      "evaluasi-strategis-pencapaian-tahunan-hmpg-itb",
    );
  });
});
