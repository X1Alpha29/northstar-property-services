
import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PENDING_PREFIX = "enquiries/pending/";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const DELETE_BATCH_SIZE = 100;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("CRON_SECRET is not configured.");

    return NextResponse.json(
      { error: "Cleanup job is not configured." },
      { status: 500 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  const dryRun =
    process.env.NODE_ENV !== "production" &&
    new URL(request.url).searchParams.get("dryRun") === "1";

  try {
    // Never delete a photo that is referenced by an enquiry.
    const linkedPhotos = await prisma.enquiryPhoto.findMany({
      select: {
        storageKey: true,
      },
    });

    const linkedStorageKeys = new Set(
      linkedPhotos.map((photo) => photo.storageKey),
    );

    const cutoff = Date.now() - MAX_AGE_MS;
    const candidates: string[] = [];

    // Read every page of pending uploads.
    let cursor: string | undefined;

    while (true) {
      const page = await list({
        prefix: PENDING_PREFIX,
        limit: 1000,
        ...(cursor ? { cursor } : {}),
      });

      for (const blob of page.blobs) {
        const uploadedAt = new Date(blob.uploadedAt).getTime();

        if (
          !Number.isFinite(uploadedAt) ||
          uploadedAt >= cutoff ||
          linkedStorageKeys.has(blob.pathname)
        ) {
          continue;
        }

        candidates.push(blob.url);
      }

      if (!page.hasMore) {
        break;
      }

      if (!page.cursor || page.cursor === cursor) {
        throw new Error(
          "Blob pagination could not continue safely.",
        );
      }

      cursor = page.cursor;
    }

    // Delete in smaller batches, except during a local dry run.
    let deletedCount = 0;

    if (!dryRun) {
      for (
        let index = 0;
        index < candidates.length;
        index += DELETE_BATCH_SIZE
      ) {
        const batch = candidates.slice(
          index,
          index + DELETE_BATCH_SIZE,
        );

        await del(batch);
        deletedCount += batch.length;
      }
    }

    return NextResponse.json({
      success: true,
      dryRun,
      candidateCount: candidates.length,
      deletedCount,
      message: dryRun
        ? "Dry run completed. No files were deleted."
        : "Abandoned upload cleanup completed.",
    });
  } catch (error) {
    console.error("Abandoned upload cleanup failed:", error);

    return NextResponse.json(
      { error: "The cleanup job could not be completed." },
      { status: 500 },
    );
  }
}
