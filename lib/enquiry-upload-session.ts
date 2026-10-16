
import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

export const UPLOAD_SESSION_COOKIE = "northstar_upload_session";
export const UPLOAD_SESSION_TTL_SECONDS = 60 * 60;

export type UploadSession = {
  id: string;
  expiresAt: number;
  token: string;
};

function getSecret(): string {
  const secret = process.env.UPLOAD_SESSION_SECRET;

  if (!secret || secret.length < 64) {
    throw new Error(
      "UPLOAD_SESSION_SECRET must contain at least 64 characters.",
    );
  }

  return secret;
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

export function createUploadSession(): UploadSession {
  const id = randomUUID();
  const expiresAt =
    Math.floor(Date.now() / 1000) + UPLOAD_SESSION_TTL_SECONDS;

  const payload = `${id}.${expiresAt}`;
  const token = `${payload}.${signPayload(payload)}`;

  return { id, expiresAt, token };
}

export function verifyUploadSessionToken(
  token: string | null | undefined,
): UploadSession | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [id, expiryText, signature] = parts;

  if (!/^[a-f0-9-]{36}$/i.test(id)) return null;

  const expiresAt = Number(expiryText);

  if (
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= Math.floor(Date.now() / 1000)
  ) {
    return null;
  }

  const payload = `${id}.${expiresAt}`;

  let expectedSignature: string;

  try {
    expectedSignature = signPayload(payload);
  } catch {
    return null;
  }

  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (
    received.length !== expected.length ||
    !timingSafeEqual(received, expected)
  ) {
    return null;
  }

  return { id, expiresAt, token };
}

export function getUploadSessionFromRequest(
  request: Request,
): UploadSession | null {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${UPLOAD_SESSION_COOKIE}=`));

  const token = cookie?.slice(UPLOAD_SESSION_COOKIE.length + 1);

  return verifyUploadSessionToken(token);
}

export function getUploadSessionSetCookie(
  session: UploadSession,
): string {
  const remainingSeconds = Math.max(
    0,
    session.expiresAt - Math.floor(Date.now() / 1000),
  );

  const secure =
    process.env.NODE_ENV === "production" ? "; Secure" : "";

  return [
    `${UPLOAD_SESSION_COOKIE}=${session.token}`,
    "Path=/api/enquiries",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${remainingSeconds}`,
  ].join("; ") + secure;
}
