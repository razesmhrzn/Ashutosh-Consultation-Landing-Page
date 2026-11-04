"use client";

import { FormEvent, useState } from "react";
import { CTA_TEXT } from "@/lib/config";
import {
  FACILITY_CHALLENGES,
  FACILITY_TYPES,
  type LeadFormData,
} from "@/lib/lead";
import { submitLead } from "@/lib/submit";
import type { FlodeskVerification } from "@/lib/flodesk";

type FieldName = Exclude<keyof LeadFormData, "companyWebsite">;
type FieldErrors = Partial<Record<FieldName, string>>;

const fieldOrder: FieldName[] = [
  "fullName",
  "email",
  "organization",
  "facilityType",
  "whatsapp",
  "challenge",
  "contactConsent",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const whatsappPattern = /^\+?[0-9 ()-]{7,22}$/;

function validate(data: LeadFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.fullName) errors.fullName = "Please enter your full name.";
  if (!data.email) {
    errors.email = "Please enter your work email.";
  } else if (!emailPattern.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!data.organization) {
    errors.organization = "Please enter your organization.";
  }
  if (!data.facilityType) {
    errors.facilityType = "Please select your facility type.";
  }
  if (!data.whatsapp) {
    errors.whatsapp = "Please enter your WhatsApp number.";
  } else if (!whatsappPattern.test(data.whatsapp)) {
    errors.whatsapp = "Please enter a valid WhatsApp number.";
  }
  if (!data.contactConsent) {
    errors.contactConsent = "Please confirm we may email your requested guide.";
  }

  return errors;
}

function ErrorMessage({ id, children }: { id: string; children?: string }) {
  if (!children) return null;

  return (
    <p id={id} role="alert" className="mt-2 text-sm font-semibold text-red-700">
      {children}
    </p>
  );
}

const inputClasses =
  "mt-2 min-h-14 w-full rounded-2xl border border-deep-green/20 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/65 hover:border-primary/45 focus:border-primary focus:ring-4 focus:ring-primary/15 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus:ring-red-600/10";

export default function CTAForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [verification, setVerification] = useState<FlodeskVerification | null>(null);
  const [pendingData, setPendingData] = useState<LeadFormData | null>(null);

  const clearFieldError = (field: FieldName) => {
    if (!errors[field]) return;
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const form = new FormData(event.currentTarget);
    const data: LeadFormData = {
      fullName: String(form.get("fullName") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      whatsapp: String(form.get("whatsapp") ?? "").trim(),
      organization: String(form.get("organization") ?? "").trim(),
      facilityType: String(form.get("facilityType") ?? "").trim() as LeadFormData["facilityType"],
      challenge: String(form.get("challenge") ?? "").trim() as LeadFormData["challenge"],
      contactConsent: form.get("contactConsent") === "on",
      companyWebsite: String(form.get("companyWebsite") ?? "").trim(),
    };
    const nextErrors = validate(data);
    const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);

    setErrors(nextErrors);

    if (firstInvalidField) {
      requestAnimationFrame(() => {
        document.getElementById(firstInvalidField)?.focus();
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const result = await submitLead(data);
      if (result.ok) {
        window.location.assign("/thank-you");
        return;
      }
      setPendingData(data);
      setVerification(result.verification);
      setIsSubmitting(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We couldn’t send your request. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  const completeVerification = async () => {
    if (!pendingData || !verification || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const result = await submitLead(pendingData, verification);
      if (!result.ok) throw new Error("Please retry the security check.");
      window.location.assign("/thank-you");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "The security check failed. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="get-toolkit"
      aria-labelledby="form-heading"
      className="scroll-mt-6 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-deep-green/10 bg-white shadow-panel sm:rounded-[2.5rem] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative overflow-hidden bg-deep-green px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[38px] border-white/[0.045]"
          />
          <div className="relative">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#A7D8C2]">
              Free PDF toolkit
            </p>
            <h2
              id="form-heading"
              className="mt-4 text-balance text-4xl font-bold tracking-[-0.04em] sm:text-5xl"
            >
              Get the 30-point facility audit
            </h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/80 sm:text-lg">
              We&apos;ll email the complete checklist, reorder planner, supplier scorecard, and 30-day action plan.
            </p>
            <ul className="mt-8 space-y-4 text-sm leading-6 text-white/90" role="list">
              <li className="flex gap-3"><span aria-hidden="true" className="text-[#A7D8C2]">✓</span> Built for hospitals, schools, hotels, offices, and commercial buildings</li>
              <li className="flex gap-3"><span aria-hidden="true" className="text-[#A7D8C2]">✓</span> Printable and easy to complete with your team</li>
              <li className="flex gap-3"><span aria-hidden="true" className="text-[#A7D8C2]">✓</span> No newsletter subscription required</li>
            </ul>
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
        >
          <div>
            {verification ? (
              <div className="flex min-h-[30rem] flex-col items-center justify-center text-center">
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-primary">One final step</p>
                <h3 className="mt-3 text-2xl font-bold text-ink">Confirm you are not a robot</h3>
                <p className="mt-3 max-w-md text-base leading-7 text-muted">Flodesk requires this quick security check before adding your details.</p>
                {submitError ? <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{submitError}</div> : null}
                <button type="button" onClick={completeVerification} disabled={isSubmitting} className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-base font-bold text-white shadow-button transition hover:bg-deep-green disabled:cursor-wait disabled:opacity-75">
                  {isSubmitting ? "Verifying…" : "I am not a robot — continue"}
                </button>
              </div>
            ) : (
              <>
            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="companyWebsite">Company website</label>
              <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="text-sm font-bold text-ink">
                Full name <span aria-hidden="true">*</span>
              </label>
              <input id="fullName" name="fullName" type="text" autoComplete="name" required placeholder="Your full name" aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} onChange={() => clearFieldError("fullName")} className={inputClasses} />
              <ErrorMessage id="fullName-error">{errors.fullName}</ErrorMessage>
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-bold text-ink">
                Work email <span aria-hidden="true">*</span>
              </label>
              <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required placeholder="you@organization.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} onChange={() => clearFieldError("email")} className={inputClasses} />
              <ErrorMessage id="email-error">{errors.email}</ErrorMessage>
            </div>

            <div>
              <label htmlFor="organization" className="text-sm font-bold text-ink">
                Organization <span aria-hidden="true">*</span>
              </label>
              <input id="organization" name="organization" type="text" autoComplete="organization" required placeholder="Facility or company name" aria-invalid={Boolean(errors.organization)} aria-describedby={errors.organization ? "organization-error" : undefined} onChange={() => clearFieldError("organization")} className={inputClasses} />
              <ErrorMessage id="organization-error">{errors.organization}</ErrorMessage>
            </div>

            <div>
              <label htmlFor="facilityType" className="text-sm font-bold text-ink">
                Facility type <span aria-hidden="true">*</span>
              </label>
              <select id="facilityType" name="facilityType" required defaultValue="" aria-invalid={Boolean(errors.facilityType)} aria-describedby={errors.facilityType ? "facilityType-error" : undefined} onChange={() => clearFieldError("facilityType")} className={inputClasses}>
                <option value="" disabled>Select one</option>
                {FACILITY_TYPES.map((facilityType) => <option key={facilityType} value={facilityType}>{facilityType}</option>)}
              </select>
              <ErrorMessage id="facilityType-error">{errors.facilityType}</ErrorMessage>
            </div>

            <div>
              <label htmlFor="whatsapp" className="text-sm font-bold text-ink">
                WhatsApp <span aria-hidden="true">*</span>
              </label>
              <input id="whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+977 98XXXXXXXX" aria-invalid={Boolean(errors.whatsapp)} aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined} onChange={() => clearFieldError("whatsapp")} className={inputClasses} />
              <ErrorMessage id="whatsapp-error">{errors.whatsapp}</ErrorMessage>
            </div>

            <div>
              <label htmlFor="challenge" className="text-sm font-bold text-ink">
                Biggest challenge <span className="ml-1 font-normal text-muted">(optional)</span>
              </label>
              <select id="challenge" name="challenge" defaultValue="" className={inputClasses}>
                <option value="">Select one</option>
                {FACILITY_CHALLENGES.map((challenge) => <option key={challenge} value={challenge}>{challenge}</option>)}
              </select>
            </div>
            </div>

            <div className="mt-6">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-light-green/65 p-4 text-sm leading-6 text-ink">
                <input id="contactConsent" name="contactConsent" type="checkbox" required aria-invalid={Boolean(errors.contactConsent)} aria-describedby={errors.contactConsent ? "contactConsent-error" : undefined} onChange={() => clearFieldError("contactConsent")} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
                <span>Email me the requested toolkit and allow Ashutosh Trade to contact me about my audit and relevant facility-supply needs.</span>
              </label>
              <ErrorMessage id="contactConsent-error">{errors.contactConsent}</ErrorMessage>
            </div>

            {submitError ? (
              <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-center text-base font-bold text-white shadow-button transition duration-200 hover:-translate-y-0.5 hover:bg-deep-green hover:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary/30 disabled:cursor-wait disabled:opacity-75 disabled:hover:translate-y-0"
            >
              {isSubmitting ? "Sending…" : CTA_TEXT}
            </button>
            <p className="mt-4 text-center text-sm text-muted">
              Practical guidance only. No spam. Unsubscribe from follow-up at any time.
            </p>
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
