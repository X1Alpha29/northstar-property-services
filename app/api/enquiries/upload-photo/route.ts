
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getUploadSessionFromRequest } from "@/lib/enquiry-upload-session";
import { enforceRateLimit } from "@/lib/rate-limit";


const MAX_FILE_SIZE = 3 * 1024 * 1024;

const ALLOWED_TYPES = {
  "image/jpeg": {
    extension: "jpg",
    signature: (bytes: Uint8Array) =>
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff,
  },
  "image/png": {
    extension: "png",
    signature: (bytes: Uint8Array) =>
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a,
  },
  "image/webp": {
    extension: "webp",
    signature: (bytes: Uint8Array) =>
      bytes.length >= 12 &&
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP",
  },
} as const;

export async function POST(request: Request) {
  let formData: FormData;
  const blocked = await enforceRateLimit(request, "photo-upload");

  if (blocked) {
    return blocked;
  }

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "The uploaded file could not be read." },
      { status: 400 },
    );
  }

  const session = getUploadSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      {
        error:
          "Your security session has expired. Please complete the security check again.",
      },
      { status: 403 },
    );
  }

  const file = formData.get("photo");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Please select a photo to upload." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Each compressed photo must be 3 MB or smaller." },
      { status: 413 },
    );
  }

  const imageType =
    Object.prototype.hasOwnProperty.call(ALLOWED_TYPES, file.type)
      ? (file.type as keyof typeof ALLOWED_TYPES)
      : null;

  if (!imageType) {
    return NextResponse.json(
      { error: "Only JPEG, PNG and WebP images are accepted." },
      { status: 400 },
    );
  }

  const header = new Uint8Array(
    await file.slice(0, 12).arrayBuffer(),
  );

  const imageDefinition = ALLOWED_TYPES[imageType];

  if (!imageDefinition.signature(header)) {
    return NextResponse.json(
      { error: "The file does not appear to be a valid image." },
      { status: 400 },
    );
  }

  try {

    const pathname =
      `enquiries/pending/${session.id}/${randomUUID()}.` +
      imageDefinition.extension;

    const blob = await put(pathname, file, {
      access: "private",
      contentType: imageType,
    });

    const response = NextResponse.json(
      {
        photo: {
          url: blob.url,
          pathname: blob.pathname,
          originalName: file.name
            .replace(/[\r\n\0]/g, "")
            .slice(0, 255),
          mimeType: imageType,
          sizeBytes: file.size,
        },
      },
      { status: 201 },
    );

    return response;
  } catch (error) {
    console.error("Photo upload failed:", error);

    return NextResponse.json(
      {
        error: "The photo could not be uploaded. Please try again.",
      },
      { status: 500 },
    );
  }
}
