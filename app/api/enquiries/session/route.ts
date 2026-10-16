
import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  createUploadSession,
  getUploadSessionSetCookie,
} from "@/lib/enquiry-upload-session";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const blocked = await enforceRateLimit(
    request,
    "session-create",
  );

  if (blocked) {
    return blocked;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "The verification request could not be read." },
      { status: 400 },
    );
  }

  const token =
    typeof body === "object" && body !== null && "token" in body
      ? body.token
      : undefined;

  const verification = await verifyTurnstileToken(token);

  if (verification === "invalid") {
    return NextResponse.json(
      {
        error:
          "Bot verification failed. Please complete the verification and try again.",
      },
      { status: 403 },
    );
  }

  if (verification === "unavailable") {
    return NextResponse.json(
      {
        error:
          "Verification is temporarily unavailable. Please try again shortly.",
      },
      { status: 503 },
    );
  }

  const session = createUploadSession();

  const response = NextResponse.json(
    { verified: true },
    { status: 201 },
  );

  response.headers.set(
    "Set-Cookie",
    getUploadSessionSetCookie(session),
  );

  return response;
}
