import { NextRequest, NextResponse } from "next/server";
import { validateUrl, validateSkillName } from "@/lib/validate-input";
import { runTesslReview } from "@/lib/tessl-runner";
import { parseReviewOutput } from "@/lib/parse-review";
import type { ReviewError, ReviewResponse } from "@/lib/types";

export const maxDuration = 120;

// In-memory rate limiting: 5 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// Clean up stale entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_WINDOW_MS);

export async function POST(request: NextRequest): Promise<NextResponse<ReviewResponse>> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: { type: "server" as const, message: "Rate limit exceeded. Try again in a minute." } },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { type: "validation" as const, message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const { url, skill } = body as { url?: string; skill?: string };

  const urlResult = validateUrl(url || "");
  if (!urlResult.valid) {
    return NextResponse.json(
      { success: false, error: { type: "validation" as const, message: urlResult.reason } },
      { status: 400 }
    );
  }

  const skillResult = validateSkillName(skill || "");
  if (!skillResult.valid) {
    return NextResponse.json(
      { success: false, error: { type: "validation" as const, message: skillResult.reason } },
      { status: 400 }
    );
  }

  // Use explicitly provided skill name, or fall back to skill extracted from URL path
  const effectiveSkill = skillResult.name || urlResult.extractedSkill || undefined;

  const tesslResult = await runTesslReview(
    urlResult.normalized,
    effectiveSkill
  );

  if (!tesslResult.ok) {
    const statusCode =
      tesslResult.error.type === "timeout" ? 504 :
      tesslResult.error.type === "not_found" ? 404 : 500;

    return NextResponse.json(
      {
        success: false,
        error: {
          type: tesslResult.error.type as ReviewError["type"],
          message: tesslResult.error.message,
          availableSkills: tesslResult.error.availableSkills,
        },
      },
      { status: statusCode }
    );
  }

  const parsed = parseReviewOutput(tesslResult.result.stdout);

  return NextResponse.json({ success: true, data: parsed });
}
