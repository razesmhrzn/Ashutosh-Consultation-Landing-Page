import type { LeadFormData } from "@/lib/lead";

export type { LeadFormData } from "@/lib/lead";

export async function submitLead(data: LeadFormData): Promise<void> {
  let response: Response;

  try {
    response = await fetch("/api/lead-magnet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error(
      "We couldn’t send your request. Please check your connection and try again.",
    );
  }

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(
      result?.error ||
        "We couldn’t email the toolkit right now. Please try again in a moment.",
    );
  }
}
