import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HMPG ITB",
    short_name: "HMPG ITB",
    description:
      "Website resmi Himpunan Mahasiswa Teknik Pangan ITB untuk profil organisasi, arsip kegiatan, laporan, dan kanal kontak.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8f0",
    theme_color: "#831618",
    icons: [
      {
        src: "/assets/figma/hmpg-logo-mark.png",
        sizes: "531x531",
        type: "image/png",
      },
    ],
  };
}
