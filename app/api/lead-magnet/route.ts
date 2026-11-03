import { NextResponse } from "next/server";
import { sendLeadMagnetEmails } from "@/lib/email";
import {
  FACILITY_CHALLENGES,
  FACILITY_TYPES,
  type LeadFormData,
} from "@/lib/lead";

export const runtime = "nodejs";
export const maxDuration = 15;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const whatsappPattern = /^\+?[0-9 ()-]{7,22}$/;
const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;

type RateLimitEntry = { count: number; resetAt: number };

const globalForLeadRateLimit = globalThis as typeof globalThis & {
  leadRateLimit?: Map<string, RateLimitEntry>;
};

const leadRateLimit =
  globalForLeadRateLimit.leadRateLimit ?? new Map<string, RateLimitEntry>();

globalForLeadRateLimit.leadRateLimit = leadRateLimit;

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");

  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function clientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(request: Request): boolean {
  const now = Date.now();
  const key = clientKey(request);
  const current = leadRateLimit.get(key);

  if (!current || current.resetAt <= now) {
    leadRateLimit.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  current.count += 1;
  return current.count > maxRequestsPerWindow;
}

function validatePayload(value: unknown):
  | { data: LeadFormData; error?: never }
  | { data?: never; error: string } {
  if (!value || typeof value !== "object") {
    return { error: "Please complete the form and try again." };
  }

  const body = value as Record<string, unknown>;
  const data: LeadFormData = {
    fullName: text(body.fullName, 100),
    email: text(body.email, 180).toLowerCase(),
    whatsapp: text(body.whatsapp, 30),
    organization: text(body.organization, 160),
    facilityType: text(body.facilityType, 60) as LeadFormData["facilityType"],
    challenge: text(body.challenge, 100) as LeadFormData["challenge"],
    contactConsent: body.contactConsent === true,
    companyWebsite: text(body.companyWebsite, 200),
  };

  if (data.companyWebsite) {
    return { data };
  }

  if (data.fullName.length < 2) return { error: "Please enter your full name." };
  if (!emailPattern.test(data.email)) return { error: "Please enter a valid work email." };
  if (!data.whatsapp) return { error: "Please enter your WhatsApp number." };
  if (!whatsappPattern.test(data.whatsapp)) {
    return { error: "Please enter a valid WhatsApp number." };
  }
  if (data.organization.length < 2) return { error: "Please enter your organization." };
  if (!FACILITY_TYPES.includes(data.facilityType as (typeof FACILITY_TYPES)[number])) {
    return { error: "Please select your facility type." };
  }
  if (
    data.challenge &&
    !FACILITY_CHALLENGES.includes(
      data.challenge as (typeof FACILITY_CHALLENGES)[number],
    )
  ) {
    return { error: "Please select a valid challenge." };
  }
  if (!data.contactConsent) {
    return { error: "Please confirm that we may email the requested guide." };
  }

  return { data };
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 20_000) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = validatePayload(payload);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (result.data.companyWebsite) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendLeadMagnetEmails(result.data, request.url);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead magnet email delivery failed", error);
    return NextResponse.json(
      {
        error:
          "We could not email the toolkit right now. Please try again in a moment.",
      },
      { status: 503 },
    );
  }
}
