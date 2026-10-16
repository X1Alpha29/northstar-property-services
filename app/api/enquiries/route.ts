
import { randomBytes } from "node:crypto";
import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  getUploadSessionFromRequest,
  UPLOAD_SESSION_COOKIE,
} from "@/lib/enquiry-upload-session";
import { enforceRateLimit } from "@/lib/rate-limit";

const MAX_PHOTOS = 3;
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const MAX_TOTAL_SIZE = 3 * 1024 * 1024;

const PhotoSchema = z.object({
  url: z.string().url(),
  pathname: z
    .string()
    .regex(
      /^enquiries\/pending\/[a-f0-9-]{36}\/[a-f0-9-]{36}\.(jpg|png|webp)$/i,
    ),
  originalName: z.string().trim().min(1).max(255),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  sizeBytes: z.number().int().min(1).max(MAX_FILE_SIZE),
});

const EnquirySchema = z.object({
  service: z.enum([
    "plumbing",
    "electrical",
    "decorating",
    "repairs",
    "refurbishment",
    "maintenance",
    "other",
  ]),
  propertyType: z.enum([
    "house",
    "flat",
    "commercial",
    "other",
  ]),
  description: z.string().trim().min(10).max(3000),
  urgency: z
    .enum(["urgent", "week", "month", "flexible"])
    .default("flexible"),
  name: z.string().trim().min(2).max(120),
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(30).optional(),
  postcode: z.string().trim().min(5).max(12),
  address: z.string().trim().max(200).optional(),
  photos: z.array(PhotoSchema).max(MAX_PHOTOS).default([]),
});

function clearUploadSessionCookie(): string {
  const secure =
    process.env.NODE_ENV === "production" ? "; Secure" : "";

  return [
    `${UPLOAD_SESSION_COOKIE}=`,
    "Path=/api/enquiries",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ") + secure;
}

export async function POST(request: Request) {
  let body: unknown;
  const blocked = await enforceRateLimit(request, "photo-upload");

  if (blocked) {
    return blocked;
  }

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The submitted form could not be read." },
      { status: 400 },
    );
  }

  const result = EnquirySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Please check the information you submitted.",
        fieldErrors: result.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = result.data;
  const session = getUploadSessionFromRequest(request);

  if (!session) {
    return NextResponse.json(
      {
        error:
          "Your security session has expired. Please complete the security check again and resubmit your enquiry.",
      },
      { status: 403 },
    );
  }

  const totalSize = data.photos.reduce(
    (total, photo) => total + photo.sizeBytes,
    0,
  );

  if (totalSize > MAX_TOTAL_SIZE) {
    return NextResponse.json(
      {
        error:
          "The combined size of your photos must not exceed 3 MB.",
      },
      { status: 400 },
    );
  }

  for (const photo of data.photos) {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(photo.url);
    } catch {
      return NextResponse.json(
        { error: "One or more photo references are invalid." },
        { status: 400 },
      );
    }

    const allowedBlobHost =
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname.endsWith(".blob.vercel-storage.com");

    const decodedPath = decodeURIComponent(
      parsedUrl.pathname.replace(/^\/+/, ""),
    );

    const correctSessionPath = photo.pathname.startsWith(
      `enquiries/pending/${session.id}/`,
    );

    const matchingUrlPath = decodedPath === photo.pathname;

    const extensionMatchesType =
      (photo.mimeType === "image/jpeg" &&
        photo.pathname.toLowerCase().endsWith(".jpg")) ||
      (photo.mimeType === "image/png" &&
        photo.pathname.toLowerCase().endsWith(".png")) ||
      (photo.mimeType === "image/webp" &&
        photo.pathname.toLowerCase().endsWith(".webp"));

    if (
      !allowedBlobHost ||
      !correctSessionPath ||
      !matchingUrlPath ||
      !extensionMatchesType
    ) {
      return NextResponse.json(
        { error: "One or more photo references are invalid." },
        { status: 400 },
      );
    }
  }

  const reference =
    `NS-${Date.now().toString(36).toUpperCase()}-` +
    randomBytes(4).toString("hex").toUpperCase();

  try {
    const enquiry = await prisma.enquiry.create({
      data: {
        reference,
        service: data.service,
        propertyType: data.propertyType,
        description: data.description,
        urgency: data.urgency,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        postcode: data.postcode.toUpperCase(),
        address: data.address || null,
        photos: {
          create: data.photos.map((photo) => ({
            url: photo.url,
            storageKey: photo.pathname,
            originalName: photo.originalName
              .replace(/[\r\n\0]/g, "")
              .slice(0, 255),
            mimeType: photo.mimeType,
            sizeBytes: photo.sizeBytes,
          })),
        },
      },
      select: {
        reference: true,
      },
    });

    const response = NextResponse.json(
      {
        message: "Your quote request has been received.",
        reference: enquiry.reference,
      },
      { status: 201 },
    );

    response.headers.set(
      "Set-Cookie",
      clearUploadSessionCookie(),
    );

return response;

  } catch (error) {
    console.error("Failed to save quote enquiry:", error);

    // Remove uploaded files if the database write fails.
    if (data.photos.length > 0) {
      try {
        await del(data.photos.map((photo) => photo.url));
      } catch (cleanupError) {
        console.error(
          "Failed to clean up uploaded photos:",
          cleanupError,
        );
      }
    }

    return NextResponse.json(
      {
        error: "We could not save your enquiry. Please try again later.",
      },
      { status: 500 },
    );
  }
}
