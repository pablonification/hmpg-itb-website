import { readFile } from "node:fs/promises";

import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default async function Icon() {
  const logoBuffer = await readFile(
    new URL("../public/assets/figma/hmpg-logo-mark.png", import.meta.url),
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff8f0",
      }}
    >
      <img alt="HMPG ITB" height="512" src={logoSrc} width="512" />
    </div>,
    size,
  );
}
