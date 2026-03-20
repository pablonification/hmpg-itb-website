import type {
  ActivityHighlight,
  CmsStore,
  PageContentMap,
  ReportRecord,
  SiteSettings,
} from "@/lib/data/types";

export const seedSettings: SiteSettings = {
  organizationName: "Himpunan Mahasiswa Teknik Pangan ITB",
  shortName: "HMPG ITB",
  tagline: "Inovasi Pangan untuk Negeri",
  logoSrc: "/assets/figma/hmpg-logo-mark.png",
  footerLogoSrc: "/assets/figma/footer-logo-mark.png",
  addressLines: [
    "Gedung Labtek IIA, Kampus ITB Jatinangor",
    "Jl. Let. Jend. Purn. Dr.(HC) Mashudi No. 1, Jatinangor,",
    "Kab. Sumedang, Jawa Barat 45363.",
  ],
  footerAddressLines: [
    "Gedung Labtek IIA, Kampus ITB Jatinangor",
    "Jl. Let. Jend. Purn. Dr.(HC) Mashudi No. 1, Jatinangor,",
    "Kab. Sumedang, Jawa Barat 45363.",
  ],
  email: "hmpg_itb@km.itb.ac.id",
  driveAkademikUrl: "https://drive.google.com/",
  footerCopyright:
    "© 2026 Himpunan Mahasiswa Teknik Pangan ITB. All rights reserved.",
  socialLinks: [
    {
      platform: "instagram",
      label: "Instagram",
      href: "https://instagram.com/hmpgitb",
      handle: "@hmpgitb",
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com/company/hmpg-itb",
      handle: "Himpunan Mahasiswa Teknik Pangan ITB",
    },
    {
      platform: "youtube",
      label: "YouTube",
      href: "https://youtube.com/@HMPGITB",
      handle: "HMPG ITB",
    },
    {
      platform: "x",
      label: "X",
      href: "https://x.com/hmpgitb",
      handle: "@hmpgitb",
    },
    {
      platform: "tiktok",
      label: "TikTok",
      href: "https://www.tiktok.com/@hmpgitb",
      handle: "@hmpgitb",
    },
  ],
};

export const seedPages: PageContentMap = {
  home: {
    heroEyebrow: "Welcome to HMPG ITB Official Website",
    heroTitleLine1: "Himpunan Mahasiswa",
    heroTitleLine2: "Teknik Pangan ITB",
    heroCtaLabel: "Learn More",
    heroImageSrc: "/assets/figma/home-hero-flag.png",
    summaryParagraphs: [
      "Himpunan Mahasiswa Teknik Pangan Institut Teknologi Bandung (HMPG ITB) didirikan pada 12 Mei 2015 sebagai organisasi yang beranggotakan mahasiswa Program Studi Teknik Pangan ITB. HMPG ITB hadir sebagai wadah untuk mengembangkan potensi, memperluas wawasan, serta membangun kebersamaan sebagai satu kesatuan. ",
    ],
    summaryTextureSrc: "/assets/figma/home-summary-texture.png",
    reportsSectionEyebrow: "Kegiatan",
    reportsSectionTitle: "HMPG Reports",
  },
  about: {
    heroTitle: "About Us",
    heroImageSrc: "/assets/figma/about-hero-edited.png",
    historyEyebrow: "Our Journey",
    historyTitle: "The steps that shaped HMPG ITB into what it is today.",
    historyParagraphs: [
      "Program Studi Teknik Pangan ITB resmi didirikan pada tahun 2014 sebagai pengembangan dari bidang keilmuan Teknik Kimia di Fakultas Teknologi Industri ITB. Kehadirannya menjadi jawaban atas kebutuhan tenaga profesional di industri pangan yang terus berkembang. Angkatan pertama, yaitu mahasiswa tahun 2015, memulai perkuliahan di Kampus Ganesha sebelum melanjutkan studi di Kampus Jatinangor, yang hingga kini menjadi pusat kegiatan akademik. Program studi ini juga telah meraih akreditasi “Unggul” dari BAN-PT.",
      "Seiring dengan berdirinya program studi, Himpunan Mahasiswa Teknik Pangan (HMPG) ITB mulai dirintis oleh angkatan 2015 pada masa akhir Tahap Persiapan Bersama. Melalui diskusi bersama HIMATEK ITB, diputuskan bahwa HMPG ITB berdiri secara mandiri, dengan dukungan awal berupa pembinaan dan pelaksanaan ospek jurusan. HMPG ITB kemudian resmi didirikan pada 12 Mei 2015 dan terus berkembang sebagai wadah bagi mahasiswa Teknik Pangan untuk berorganisasi, mengembangkan potensi, serta mempererat kebersamaan.",
    ],
    historyImageSrc: "/assets/figma/about-campus-building-edited.png",
    visionBadgeSrc: "/assets/figma/about-vision-badge.png",
    vision:
      "HMPG ITB as a space where personal and professional growth synchronize within a collaborative, impactful, and sustainable learning environment.",
    missions: [
      "Membangun komunitas yang kolaboratif, inklusif, dan apresiatif untuk memperkuat hubungan antaranggota HMPG ITB.",
      "Mendukung proses bertumbuhnya anggota HMPG ITB agar selaras dengan kebutuhan anggota dan tujuan organisasi.",
      "Menyelaraskan penguatan keilmuan dan keprofesian dengan pengembangan diri melalui program yang relevan, terarah, dan mudah diakses.",
      "Mendorong kontribusi nyata yang berdampak dan berkelanjutan bagi masyarakat.",
      "Membangun sistem organisasi yang terstruktur, transparan, dan terevaluasi secara berkala dengan tata kelola yang efektif.",
      "Memperluas dan memperkuat relasi eksternal untuk membuka peluang pengembangan dan kolaborasi bagi anggota HMPG ITB.",
    ],
    values: ["Solidaritas", "Apresiasi", "Daya Juang Tinggi"],
    logoMeaningTitle: "Makna Logo HMPG ITB",
    logoMeaningDescription:
      "Logo Himpunan Mahasiswa Teknik Pangan ITB memuat logo Ganesha yang merepresentasikan bahwa HMPG ITB merupakan bagian dari Civitas Akademika Institut Teknologi Bandung. Di dalamnya, elemen utama berupa satu cerobong, empat pabrik, dan tiga pasang bulir padi merepresentasikan keilmuan serta keprofesian Teknik Pangan.",
    logoShowcaseSrc: "/assets/figma/about-logo-identity.png",
    identityTextureSrc: "/assets/figma/about-canvas-texture.png",
    valuesSectionTitle: "Visi, Misi, & Nilai",
    valuesSectionPeriodLabel: 'BP "Polaris" HMPG ITB 2026/2027',
    identitySectionEyebrow: "Simbolisme",
    identitySectionTitle: "Identitas Visual",
  },
  reports: {
    heroTitle: "HMPG ITB Activities & Reports",
    heroDescription:
      "Explore the stories, milestones, and journey that define HMPG ITB.",
    heroImageSrc: "/assets/figma/reports-hero-edited.png",
    driveTitle: "HMPG ITB Member’s Archives",
    driveCtaLabel: "Open Archive Folder",
    featuredReportSlug: "evaluasi-strategis-pencapaian-tahunan-hmpg-itb",
    latestSectionTitle: "Latest Report",
  },
  contact: {
    heroEyebrow: "Hubungi Kami",
    heroTitle: "Contact Us",
    heroDescription:
      "Contact us for more information. We'll do our best to get back to you as soon as possible.",
    showcaseImageSrc: "/assets/figma/contact-showcase-bg.png",
    officeTitle: "Sekretariat",
    officeAddress: "Gedung Labtek IIA, Kampus ITB Jatinangor",
    socialSectionTitle: "Sosial Media",
  },
};

export const seedActivities: ActivityHighlight[] = [
  {
    id: "pangan-masa-depan",
    category: "PENGEMBANGAN",
    title: "Pangan Masa Depan: Seminar Nasional Teknologi Pasca Panen",
    description:
      "Mengkaji tantangan rantai pasok pangan global dan peran teknologi dalam meminimalisir food loss di Indonesia.",
    imageSrc: "/assets/figma/home-featured-seminar.png",
    variant: "feature",
  },
  {
    id: "research-grant",
    category: "PENGEMBANGAN",
    title: "HMPG Research Grant: Batch 2024 Dibuka",
    description:
      "Pendanaan riset mandiri bagi mahasiswa untuk inovasi produk berbasis bahan lokal.",
    imageSrc: "/assets/figma/home-research-grant.png",
    variant: "vertical",
  },
  {
    id: "desa-binaan",
    badge: "Terbaru",
    category: "SOSIAL",
    title: "Desa Binaan HMPG: Implementasi Sistem Irigasi Cerdas",
    description:
      "Kolaborasi dengan masyarakat Pangalengan dalam meningkatkan efisiensi penggunaan air untuk perkebunan kentang menggunakan sensor IoT sederhana.",
    imageSrc: "/assets/figma/home-desa-binaan.png",
    variant: "wide",
  },
];

const featuredBodyHtml = `
  <section>
    <h2>Latar Belakang</h2>
    <p>Ketahanan pangan di tingkat desa merupakan fondasi utama dalam menjaga stabilitas nutrisi masyarakat secara nasional. Berdasarkan pengamatan Divisi Pengabdian Masyarakat HMPG ITB di tahun 2024, terjadi pergeseran signifikan dalam pola konsumsi dan produksi pangan di wilayah Desa Binaan. Modernisasi teknologi pangan belum sepenuhnya terintegrasi dengan kearifan lokal, menciptakan celah efisiensi yang perlu segera dianalisis secara akademis.</p>
  </section>
  <blockquote>
    <p>"Inovasi pangan bukan hanya soal teknologi, melainkan bagaimana teknologi tersebut mampu beradaptasi dengan realitas sosiokultural di tingkat akar rumput."</p>
    <cite>— Dr. Ir. Ahmad Sudirjo, Pembina HMPG</cite>
  </blockquote>
  <section>
    <h2>Metodologi</h2>
    <p>Penelitian ini menggunakan pendekatan kualitatif dan kuantitatif melalui survei rumah tangga (n=150) dan Focus Group Discussion (FGD) bersama tokoh masyarakat desa. Kami membagi variabel analisis menjadi tiga pilar utama:</p>
    <ol>
      <li>Ketahanan akses pangan rumah tangga dari sisi distribusi dan harga.</li>
      <li>Keberagaman konsumsi dan peluang diversifikasi bahan pangan lokal.</li>
      <li>Kesiapan adopsi teknologi pengolahan pascapanen pada level komunitas.</li>
    </ol>
    <figure>
      <img src="/assets/figma/report-inline-field.png" alt="Observasi lapangan ketahanan pangan" />
      <figcaption>Gambar 1.2: Observasi lapangan terhadap komoditas pangan lokal di Desa Binaan Ciparay.</figcaption>
    </figure>
  </section>
  <section>
    <h2>Hasil Analisis</h2>
    <p>Temuan awal menunjukkan bahwa 65% masyarakat desa masih sangat bergantung pada satu jenis komoditas karbohidrat utama. Diversifikasi pangan terhambat oleh minimnya edukasi pengolahan bahan alternatif seperti umbi-umbian dan sorgum yang sebenarnya melimpah secara geografis di wilayah tersebut.</p>
  </section>
`;

export const seedReports: ReportRecord[] = [
  {
    id: "report-1",
    slug: "evaluasi-strategis-pencapaian-tahunan-hmpg-itb",
    title: "Evaluasi Strategis & Pencapaian Tahunan HMPG ITB",
    excerpt:
      "Dokumen komprehensif yang merangkum seluruh kegiatan, audit keuangan, dan evaluasi performa divisi sepanjang periode 2023.",
    category: "laporan-akhir-tahun",
    categoryLabel: "Laporan Akhir Tahun 2023",
    coverImageSrc: "/assets/figma/report-detail-hero.png",
    cardImageSrc: "/assets/figma/reports-featured-terrace.png",
    publishedAt: "2026-03-12T00:00:00.000Z",
    year: "2026",
    periodLabel: "Maret 2026",
    editionLabel: "Laporan Akhir Tahun",
    author: "Divisi Pengabdian Masyarakat",
    status: "published",
    featured: true,
    coverCaption:
      "Gambar 1.1: Observasi lapangan terhadap komoditas pangan lokal di Desa Binaan Ciparay.",
    bodyHtml: featuredBodyHtml,
    relatedSlugs: [
      "manajemen-limbah-organik-di-pasar-induk-caringin",
      "implementasi-panel-surya-pada-pengolahan-pasca-panen",
      "digitalisasi-rantai-pasok-pangan-di-jawa-barat",
    ],
  },
  {
    id: "report-2",
    slug: "laporan-kajian-geospasial-perkotaan-bandung",
    title: "Laporan Kajian Geospasial Perkotaan Bandung",
    excerpt:
      "Analisis mendalam mengenai perubahan tata guna lahan di kawasan Bandung Utara menggunakan data satelit.",
    category: "keilmuan",
    categoryLabel: "Keilmuan",
    coverImageSrc: "/assets/figma/reports-card-keilmuan.png",
    cardImageSrc: "/assets/figma/reports-card-keilmuan.png",
    publishedAt: "2023-11-20T00:00:00.000Z",
    year: "2023",
    periodLabel: "Nov 2023",
    editionLabel: "VOL. 08 / NOV 2024",
    author: "Divisi Keilmuan",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Analisis geospasial ini mengevaluasi dinamika penggunaan lahan dan dampaknya terhadap rantai pasok pangan perkotaan.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-3",
    slug: "dokumentasi-desa-binaan-pemetaan-partisipatif",
    title: "Dokumentasi Desa Binaan: Pemetaan Partisipatif",
    excerpt:
      "Laporan pelaksanaan kegiatan pemetaan batas desa bersama masyarakat lokal di Sumedang.",
    category: "pengmas",
    categoryLabel: "Pengmas",
    coverImageSrc: "/assets/figma/reports-card-pengmas.png",
    cardImageSrc: "/assets/figma/reports-card-pengmas.png",
    publishedAt: "2023-10-10T00:00:00.000Z",
    year: "2023",
    periodLabel: "Okt 2023",
    editionLabel: "Laporan Pengmas",
    author: "Divisi Pengabdian Masyarakat",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Dokumentasi kegiatan pemetaan partisipatif yang menitikberatkan pada kolaborasi lapangan bersama warga.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-4",
    slug: "evaluasi-program-orientasi-anggota-muda",
    title: "Evaluasi Program Orientasi Anggota Muda",
    excerpt:
      "Analisis keberhasilan kurikulum kaderisasi dan tingkat partisipasi mahasiswa baru.",
    category: "kaderisasi",
    categoryLabel: "Kaderisasi",
    coverImageSrc: "/assets/figma/reports-card-kaderisasi.png",
    cardImageSrc: "/assets/figma/reports-card-kaderisasi.png",
    publishedAt: "2023-09-14T00:00:00.000Z",
    year: "2023",
    periodLabel: "Sep 2023",
    editionLabel: "Laporan Kaderisasi",
    author: "Divisi Kaderisasi",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Evaluasi menyeluruh terhadap pengalaman orientasi dan kurikulum pendewasaan anggota baru.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-5",
    slug: "analisis-media-komunikasi-publik-triwulan-ii",
    title: "Analisis Media & Komunikasi Publik Triwulan II",
    excerpt:
      "Data reach dan engagement platform digital HMPG ITB selama tiga bulan terakhir.",
    category: "keuangan",
    categoryLabel: "Keuangan",
    coverImageSrc: "/assets/figma/reports-card-keuangan.png",
    cardImageSrc: "/assets/figma/reports-card-keuangan.png",
    publishedAt: "2023-08-22T00:00:00.000Z",
    year: "2023",
    periodLabel: "Agu 2023",
    editionLabel: "Laporan Keuangan",
    author: "Divisi Media",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Ikhtisar performa komunikasi publik HMPG ITB beserta rekomendasi editorial untuk kanal digital.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-6",
    slug: "audit-inventaris-alat-survey-laboratorium",
    title: "Audit Inventaris Alat Survey & Laboratorium",
    excerpt:
      "Laporan kondisi terkini alat survey milik himpunan dan rencana pemeliharaan rutin.",
    category: "inventaris",
    categoryLabel: "Inventaris",
    coverImageSrc: "/assets/figma/reports-card-inventaris.png",
    cardImageSrc: "/assets/figma/reports-card-inventaris.png",
    publishedAt: "2023-06-02T00:00:00.000Z",
    year: "2023",
    periodLabel: "Jun 2023",
    editionLabel: "Laporan Inventaris",
    author: "Divisi Inventaris",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Audit tahunan untuk aset lapangan dan laboratorium sebagai dasar pembenahan inventaris kerja.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-7",
    slug: "prosiding-seminar-nasional-geodesi-itb",
    title: "Prosiding Seminar Nasional Geodesi ITB",
    excerpt:
      "Kumpulan abstrak dan materi pemaparan dari praktisi industri geospasial.",
    category: "seminar",
    categoryLabel: "Seminar",
    coverImageSrc: "/assets/figma/reports-card-seminar.png",
    cardImageSrc: "/assets/figma/reports-card-seminar.png",
    publishedAt: "2023-05-18T00:00:00.000Z",
    year: "2023",
    periodLabel: "Mei 2023",
    editionLabel: "Laporan Seminar",
    author: "Divisi Seminar",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Prosiding kegiatan seminar nasional sebagai arsip resmi materi dan catatan pembicara.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-8",
    slug: "manajemen-limbah-organik-di-pasar-induk-caringin",
    title: "Manajemen Limbah Organik di Pasar Induk Caringin",
    excerpt:
      "Studi kasus pengolahan limbah organik untuk meningkatkan efisiensi rantai distribusi pascapanen.",
    category: "studi-kasus",
    categoryLabel: "Studi Kasus",
    coverImageSrc: "/assets/figma/report-related-waste.png",
    publishedAt: "2024-02-05T00:00:00.000Z",
    year: "2024",
    periodLabel: "Feb 2024",
    editionLabel: "Studi Kasus",
    author: "Tim Kajian",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Laporan ini memetakan proses pemanfaatan limbah organik di pusat distribusi pangan perkotaan.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-9",
    slug: "implementasi-panel-surya-pada-pengolahan-pasca-panen",
    title: "Implementasi Panel Surya pada Pengolahan Pasca Panen",
    excerpt:
      "Laporan teknis penerapan energi terbarukan dalam sistem pengeringan komoditas.",
    category: "laporan-teknis",
    categoryLabel: "Laporan Teknis",
    coverImageSrc: "/assets/figma/report-related-solar.png",
    publishedAt: "2024-01-20T00:00:00.000Z",
    year: "2024",
    periodLabel: "Jan 2024",
    editionLabel: "Laporan Teknis",
    author: "Tim Teknologi",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Eksperimen teknis yang membahas kelayakan panel surya untuk mendukung pengolahan pascapanen skala komunitas.</p></section>",
    relatedSlugs: [],
  },
  {
    id: "report-10",
    slug: "digitalisasi-rantai-pasok-pangan-di-jawa-barat",
    title: "Digitalisasi Rantai Pasok Pangan di Jawa Barat",
    excerpt:
      "Editorial mengenai peluang digitalisasi distribusi pangan dan koordinasi lintas pelaku.",
    category: "editorial",
    categoryLabel: "Editorial",
    coverImageSrc: "/assets/figma/report-related-digital.png",
    publishedAt: "2024-01-10T00:00:00.000Z",
    year: "2024",
    periodLabel: "Jan 2024",
    editionLabel: "Editorial",
    author: "Tim Editorial",
    status: "published",
    featured: false,
    bodyHtml:
      "<section><h2>Ringkasan</h2><p>Tinjauan editorial atas peluang dan tantangan digitalisasi rantai pasok pangan di Jawa Barat.</p></section>",
    relatedSlugs: [],
  },
];

export const seedStore: CmsStore = {
  settings: seedSettings,
  pages: seedPages,
  activities: seedActivities,
  reports: seedReports,
};
