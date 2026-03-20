import type {
  AboutPageContent,
  ContactPageContent,
  HomePageContent,
  PageContentKey,
  ReportsPageContent,
  ReportRecord,
  SiteSettings,
  SocialPlatform,
} from "@/lib/data/types";

export type CmsFieldKind =
  | "text"
  | "textarea"
  | "multiline"
  | "url"
  | "datetime"
  | "checkbox";

export interface CmsFieldDefinition<T extends object> {
  key: keyof T;
  kind: CmsFieldKind;
  label: string;
  description?: string;
}

export interface CmsSectionDefinition<T extends object> {
  title: string;
  description: string;
  fields: CmsFieldDefinition<T>[];
}

export const reportCategoryOptions = [
  {
    value: "laporan-akhir-tahun",
    label: "Laporan Akhir Tahun",
    description: "Rangkuman tahunan organisasi dan pencapaian besar.",
  },
  {
    value: "keilmuan",
    label: "Keilmuan",
    description: "Kajian akademik, riset, dan pemetaan pengetahuan.",
  },
  {
    value: "pengmas",
    label: "Pengmas",
    description: "Laporan pengabdian masyarakat dan dampak lapangan.",
  },
  {
    value: "kaderisasi",
    label: "Kaderisasi",
    description: "Program pengembangan anggota dan regenerasi.",
  },
  {
    value: "keuangan",
    label: "Keuangan",
    description: "Transparansi anggaran, audit, dan pertanggungjawaban dana.",
  },
  {
    value: "inventaris",
    label: "Inventaris",
    description: "Pencatatan aset, alat, dan kebutuhan operasional.",
  },
  {
    value: "seminar",
    label: "Seminar",
    description: "Prosiding acara, webinar, dan forum ilmiah.",
  },
  {
    value: "studi-kasus",
    label: "Studi Kasus",
    description: "Analisis mendalam terhadap peristiwa atau objek tertentu.",
  },
  {
    value: "laporan-teknis",
    label: "Laporan Teknis",
    description: "Dokumentasi teknis, implementasi, dan evaluasi operasional.",
  },
  {
    value: "editorial",
    label: "Editorial",
    description: "Tulisan naratif, opini, dan sudut pandang organisasi.",
  },
] as const;

export const dashboardContentTabs = [
  {
    key: "settings",
    label: "Global Settings",
    description: "Identitas, kontak, dan sosial media organisasi.",
  },
  {
    key: "home",
    label: "Home",
    description: "Hero, ringkasan, dan pengantar halaman utama.",
  },
  {
    key: "about",
    label: "About",
    description: "Narasi organisasi, sejarah, dan identitas.",
  },
  {
    key: "reports",
    label: "Reports",
    description: "Hero halaman laporan dan CTA arsip.",
  },
  {
    key: "contact",
    label: "Contact",
    description: "Headline kontak, alamat, dan CTA sosial.",
  },
] as const;

export const assetManagedPageFieldKeys = {
  home: ["heroImageSrc"],
  about: [
    "heroImageSrc",
    "historyImageSrc",
    "visionBadgeSrc",
    "logoShowcaseSrc",
  ],
  reports: ["heroImageSrc", "featuredReportSlug"],
  contact: ["showcaseImageSrc"],
} as const satisfies Record<PageContentKey, readonly string[]>;

export const cmsSocialPlatforms = [
  {
    platform: "instagram",
    label: "Instagram",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
  },
  {
    platform: "youtube",
    label: "YouTube",
  },
  {
    platform: "x",
    label: "X",
  },
  {
    platform: "tiktok",
    label: "TikTok",
  },
] as const satisfies { platform: SocialPlatform; label: string }[];

export const siteSettingsSections = [
  {
    title: "Brand & Contact",
    description:
      "Kelola identitas singkat organisasi dan jalur kontak utama yang tampil di website publik.",
    fields: [
      {
        key: "shortName",
        kind: "text",
        label: "Short name",
      },
      {
        key: "email",
        kind: "text",
        label: "Email",
      },
      {
        key: "driveAkademikUrl",
        kind: "url",
        label: "Drive Akademik URL",
      },
      {
        key: "footerCopyright",
        kind: "text",
        label: "Footer copyright",
      },
      {
        key: "footerAddressLines",
        kind: "multiline",
        label: "Footer address lines",
      },
    ],
  },
] as const satisfies CmsSectionDefinition<SiteSettings>[];

export const pageContentSections = {
  home: [
    {
      title: "Hero",
      description: "Edit hero copy dan visual utama halaman beranda.",
      fields: [
        {
          key: "heroEyebrow",
          kind: "text",
          label: "Hero eyebrow",
        },
        {
          key: "heroTitleLine1",
          kind: "text",
          label: "Hero title line 1",
        },
        {
          key: "heroTitleLine2",
          kind: "text",
          label: "Hero title line 2",
        },
        {
          key: "heroCtaLabel",
          kind: "text",
          label: "Hero CTA label",
        },
        {
          key: "heroImageSrc",
          kind: "url",
          label: "Hero image URL",
          description: "Dikelola dari halaman Assets.",
        },
      ],
    },
    {
      title: "Summary & Reports",
      description:
        "Atur ringkasan organisasi dan heading section laporan di beranda.",
      fields: [
        {
          key: "summaryParagraphs",
          kind: "multiline",
          label: "Summary paragraphs",
        },
        {
          key: "reportsSectionEyebrow",
          kind: "text",
          label: "Reports section eyebrow",
        },
        {
          key: "reportsSectionTitle",
          kind: "text",
          label: "Reports section title",
        },
      ],
    },
  ],
  about: [
    {
      title: "Hero & Journey",
      description:
        "Kelola headline, narasi perjalanan, dan visual utama halaman About Us.",
      fields: [
        {
          key: "heroTitle",
          kind: "text",
          label: "Hero title",
        },
        {
          key: "heroImageSrc",
          kind: "url",
          label: "Hero image URL",
          description: "Dikelola dari halaman Assets.",
        },
        {
          key: "historyEyebrow",
          kind: "text",
          label: "History eyebrow",
        },
        {
          key: "historyTitle",
          kind: "text",
          label: "History title",
        },
        {
          key: "historyParagraphs",
          kind: "multiline",
          label: "History paragraphs",
        },
        {
          key: "historyImageSrc",
          kind: "url",
          label: "History image URL",
          description: "Dikelola dari halaman Assets.",
        },
      ],
    },
    {
      title: "Values & Identity",
      description:
        "Atur copy section visi-misi-nilai dan identitas visual yang bersifat periodik.",
      fields: [
        {
          key: "valuesSectionTitle",
          kind: "text",
          label: "Values section title",
        },
        {
          key: "valuesSectionPeriodLabel",
          kind: "text",
          label: "Values period label",
        },
        {
          key: "vision",
          kind: "textarea",
          label: "Vision",
        },
        {
          key: "missions",
          kind: "multiline",
          label: "Missions",
        },
        {
          key: "values",
          kind: "multiline",
          label: "Values",
        },
        {
          key: "identitySectionEyebrow",
          kind: "text",
          label: "Identity section eyebrow",
        },
        {
          key: "identitySectionTitle",
          kind: "text",
          label: "Identity section title",
        },
        {
          key: "logoMeaningTitle",
          kind: "text",
          label: "Logo meaning title",
        },
        {
          key: "logoMeaningDescription",
          kind: "textarea",
          label: "Logo meaning description",
        },
        {
          key: "logoShowcaseSrc",
          kind: "url",
          label: "Logo image URL",
          description: "Dikelola dari halaman Assets.",
        },
      ],
    },
  ],
  reports: [
    {
      title: "Hero & Archive Banner",
      description:
        "Atur hero halaman reports, CTA arsip, dan featured report untuk landing archive.",
      fields: [
        {
          key: "heroTitle",
          kind: "text",
          label: "Hero title",
        },
        {
          key: "heroDescription",
          kind: "textarea",
          label: "Hero description",
        },
        {
          key: "heroImageSrc",
          kind: "url",
          label: "Hero image URL",
          description: "Dikelola dari halaman Assets.",
        },
        {
          key: "driveTitle",
          kind: "text",
          label: "Drive title",
        },
        {
          key: "driveCtaLabel",
          kind: "text",
          label: "Drive CTA label",
        },
        {
          key: "featuredReportSlug",
          kind: "text",
          label: "Featured report slug",
        },
        {
          key: "latestSectionTitle",
          kind: "text",
          label: "Latest reports section title",
        },
      ],
    },
  ],
  contact: [
    {
      title: "Hero & Office",
      description:
        "Kelola headline kontak, alamat sekretariat, dan visual showcase halaman Contact Us.",
      fields: [
        {
          key: "heroEyebrow",
          kind: "text",
          label: "Hero eyebrow",
        },
        {
          key: "heroTitle",
          kind: "text",
          label: "Hero title",
        },
        {
          key: "heroDescription",
          kind: "textarea",
          label: "Hero description",
        },
        {
          key: "officeTitle",
          kind: "text",
          label: "Office title",
        },
        {
          key: "officeAddress",
          kind: "textarea",
          label: "Office address",
        },
        {
          key: "socialSectionTitle",
          kind: "text",
          label: "Social section title",
        },
        {
          key: "showcaseImageSrc",
          kind: "url",
          label: "Showcase image URL",
          description: "Dikelola dari halaman Assets.",
        },
      ],
    },
  ],
} as const satisfies {
  home: CmsSectionDefinition<HomePageContent>[];
  about: CmsSectionDefinition<AboutPageContent>[];
  reports: CmsSectionDefinition<ReportsPageContent>[];
  contact: CmsSectionDefinition<ContactPageContent>[];
};

export const reportEditorSections = [
  {
    title: "Guided",
    description: "Field utama yang perlu diisi penulis saat membuat laporan.",
    fields: [
      {
        key: "title",
        kind: "text",
        label: "Title",
      },
      {
        key: "category",
        kind: "text",
        label: "Category",
      },
      {
        key: "excerpt",
        kind: "textarea",
        label: "Excerpt",
      },
      {
        key: "coverImageSrc",
        kind: "url",
        label: "Preview image URL",
      },
      {
        key: "bodyHtml",
        kind: "textarea",
        label: "Body HTML",
      },
      {
        key: "status",
        kind: "text",
        label: "Status",
      },
      {
        key: "featured",
        kind: "checkbox",
        label: "Jadikan featured report",
      },
    ],
  },
  {
    title: "Advanced",
    description: "Field teknis untuk admin ketika perlu penyesuaian manual.",
    fields: [
      {
        key: "slug",
        kind: "text",
        label: "Slug",
      },
      {
        key: "categoryLabel",
        kind: "text",
        label: "Category label",
      },
      {
        key: "editionLabel",
        kind: "text",
        label: "Edition label",
      },
      {
        key: "periodLabel",
        kind: "text",
        label: "Period label",
      },
      {
        key: "year",
        kind: "text",
        label: "Year",
      },
      {
        key: "author",
        kind: "text",
        label: "Author",
      },
      {
        key: "publishedAt",
        kind: "datetime",
        label: "Published at",
      },
    ],
  },
] as const satisfies CmsSectionDefinition<ReportRecord>[];

export const siteAssetSlots = [
  {
    id: "settings.logoSrc",
    label: "Header logo",
    description: "Logo yang tampil di header public site.",
    folder: "site-assets",
    targetType: "settings",
    targetKey: "logoSrc",
  },
  {
    id: "settings.footerLogoSrc",
    label: "Footer logo",
    description: "Logo yang tampil di footer public site.",
    folder: "site-assets",
    targetType: "settings",
    targetKey: "footerLogoSrc",
  },
  {
    id: "page.home.heroImageSrc",
    label: "Home hero image",
    description: "Visual utama section hero halaman home.",
    folder: "site-assets",
    targetType: "page",
    pageKey: "home",
    targetKey: "heroImageSrc",
  },
  {
    id: "page.about.heroImageSrc",
    label: "About hero image",
    description: "Visual utama hero About Us.",
    folder: "site-assets",
    targetType: "page",
    pageKey: "about",
    targetKey: "heroImageSrc",
  },
  {
    id: "page.about.historyImageSrc",
    label: "Our Journey image",
    description: "Visual pada section Our Journey.",
    folder: "site-assets",
    targetType: "page",
    pageKey: "about",
    targetKey: "historyImageSrc",
  },
  {
    id: "page.about.visionBadgeSrc",
    label: "Vision badge image",
    description: "Badge dekoratif pada kartu visi di halaman About Us.",
    folder: "site-assets",
    targetType: "page",
    pageKey: "about",
    targetKey: "visionBadgeSrc",
  },
  {
    id: "page.about.logoShowcaseSrc",
    label: "About logo showcase",
    description: "Logo showcase pada section Identitas Visual.",
    folder: "site-assets",
    targetType: "page",
    pageKey: "about",
    targetKey: "logoShowcaseSrc",
  },
  {
    id: "page.reports.heroImageSrc",
    label: "Reports hero image",
    description: "Visual utama hero halaman reports.",
    folder: "site-assets",
    targetType: "page",
    pageKey: "reports",
    targetKey: "heroImageSrc",
  },
  {
    id: "page.contact.showcaseImageSrc",
    label: "Contact showcase image",
    description: "Visual utama showcase di bagian bawah contact page.",
    folder: "site-assets",
    targetType: "page",
    pageKey: "contact",
    targetKey: "showcaseImageSrc",
  },
] as const;

export function getSocialFieldName(
  platform: SocialPlatform,
  key: "label" | "href" | "handle",
) {
  return `socialLinks.${platform}.${key}`;
}

export function getFieldsFromSections<T extends object>(
  sections: readonly CmsSectionDefinition<T>[],
) {
  return sections.flatMap((section) => section.fields);
}

export function getReportCategoryOption(value: string) {
  return reportCategoryOptions.find((option) => option.value === value);
}

export function getReportCategoryLabel(value: string) {
  return getReportCategoryOption(value)?.label ?? "Editorial";
}

export const cmsOwnedSettingKeys = getFieldsFromSections(
  siteSettingsSections,
).map((field) => field.key);

export const cmsOwnedReportKeys = getFieldsFromSections(
  reportEditorSections,
).map((field) => field.key);

export const cmsOwnedPageKeys = {
  home: getFieldsFromSections(pageContentSections.home).map(
    (field) => field.key,
  ),
  about: getFieldsFromSections(pageContentSections.about).map(
    (field) => field.key,
  ),
  reports: getFieldsFromSections(pageContentSections.reports).map(
    (field) => field.key,
  ),
  contact: getFieldsFromSections(pageContentSections.contact).map(
    (field) => field.key,
  ),
} as const satisfies Record<PageContentKey, readonly string[]>;
