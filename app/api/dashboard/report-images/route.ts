import { NextResponse } from "next/server";

import { canManageReports } from "@/lib/auth/rbac";
import { getCmsSession } from "@/lib/auth/session";
import { uploadAsset } from "@/lib/repositories/content-repository";
import { getCmsImageUploadError } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await getCmsSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!canManageReports(session.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Pilih file gambar terlebih dahulu." },
      { status: 400 },
    );
  }

  const validationError = getCmsImageUploadError(file);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const src = await uploadAsset(file, "report-media/inline");
  return NextResponse.json({ src });
}
