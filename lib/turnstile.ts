
type SiteverifyResponse = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

export type TurnstileVerificationResult =
  | "valid"
  | "invalid"
  | "unavailable";

export async function verifyTurnstileToken(
  token: unknown,
): Promise<TurnstileVerificationResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured.");
    return "unavailable";
  }

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048
  ) {
    return "invalid";
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret,
          response: token,
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return "unavailable";
    }

    const result =
      (await response.json()) as SiteverifyResponse;

    return result.success ? "valid" : "invalid";
  } catch (error) {
    console.error("Turnstile verification request failed:", error);
    return "unavailable";
  }
}
