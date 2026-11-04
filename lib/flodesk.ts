import "server-only";
import type { LeadFormData } from "@/lib/lead";

const formId = "6ae9e8069e9d389e0d93fa2b";
const submitUrl = `https://form.flodesk.com/forms/${formId}/submit`;

export type FlodeskVerification = {
  url: string;
  fieldName: string;
};

export type FlodeskSubmitResult =
  | { ok: true }
  | { ok: false; verification: FlodeskVerification };

function isAllowedVerificationUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "form.flodesk.com" &&
      new RegExp(`^/forms/${formId}/verify/[a-f0-9]+$`).test(url.pathname)
    );
  } catch {
    return false;
  }
}

async function readFlodeskResponse(response: Response): Promise<Record<string, unknown>> {
  const result = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok || !result) {
    throw new Error(`Flodesk rejected the submission (${response.status}).`);
  }
  return result;
}

export async function addFlodeskSubscriber(
  data: LeadFormData,
  verification?: FlodeskVerification,
): Promise<FlodeskSubmitResult> {
  if (verification) {
    if (
      !isAllowedVerificationUrl(verification.url) ||
      !/^[A-Za-z0-9]+$/.test(verification.fieldName)
    ) {
      throw new Error("Invalid Flodesk verification request.");
    }

    const response = await fetch(verification.url, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ [verification.fieldName]: "on" }),
      cache: "no-store",
    });
    const result = await readFlodeskResponse(response);
    if (result.status !== "success" && result.status !== "subscribed") {
      throw new Error("Flodesk could not verify the submission.");
    }
    return { ok: true };
  }

  const response = await fetch(submitUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({
      firstName: data.fullName,
      email: data.email,
      "fields.whatsappNumber": data.whatsapp,
      "fields.organization": data.organization,
      "fields.facilityType": data.facilityType,
      "fields.biggestChallenge": data.challenge || "Not specified",
      confirm_email_address: "",
    }),
    cache: "no-store",
  });
  const result = await readFlodeskResponse(response);

  if (result.status === "verifying") {
    const onVerifying = result.onVerifying as Record<string, unknown> | undefined;
    const content = typeof onVerifying?.content === "string" ? onVerifying.content : "";
    const url = typeof onVerifying?.url === "string" ? onVerifying.url : "";
    const visibleGroup = content.match(
      /<div class="fd-form-group" style="">[\s\S]*?<input[^>]+type="checkbox"[^>]+name="([A-Za-z0-9]+)"/,
    );
    const fieldName = visibleGroup?.[1] ?? "";

    if (!isAllowedVerificationUrl(url) || !fieldName) {
      throw new Error("Flodesk returned an invalid verification challenge.");
    }
    return { ok: false, verification: { url, fieldName } };
  }

  if (result.status !== "success" && result.status !== "subscribed") {
    throw new Error("Flodesk did not accept the subscriber.");
  }
  return { ok: true };
}
