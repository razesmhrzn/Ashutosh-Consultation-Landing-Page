import { FORM_ENDPOINT } from "@/lib/config";

export type LeadFormData = {
  fullName: string;
  email: string;
  whatsapp: string;
  businessName: string;
  website: string;
  message: string;
};

const SIMULATED_DELAY_MS = 700;

export async function submitLead(data: LeadFormData): Promise<void> {
  if (!FORM_ENDPOINT) {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
    return;
  }

  let response: Response;

  try {
    response = await fetch(FORM_ENDPOINT, {
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
    throw new Error(
      "We couldn’t send your request right now. Please try again in a moment.",
    );
  }
}
