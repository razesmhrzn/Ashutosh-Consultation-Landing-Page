"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CTA_TEXT } from "@/lib/config";
import { LeadFormData, submitLead } from "@/lib/submit";

type FieldName = keyof LeadFormData;
type FieldErrors = Partial<Record<FieldName, string>>;

const fieldOrder: FieldName[] = [
  "fullName",
  "email",
  "whatsapp",
  "businessName",
  "website",
  "message",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const whatsappPattern = /^\+?\d{7,15}$/;

function isValidWebUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validate(data: LeadFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.fullName) errors.fullName = "Please enter your full name.";

  if (!data.email) {
    errors.email = "Please enter your active email.";
  } else if (!emailPattern.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.whatsapp) {
    errors.whatsapp = "Please enter your WhatsApp number.";
  } else if (!whatsappPattern.test(data.whatsapp)) {
    errors.whatsapp =
      "Use 7 to 15 digits, with an optional + at the beginning.";
  }

  if (!data.businessName) {
    errors.businessName = "Please enter your business name.";
  }

  if (data.website && !isValidWebUrl(data.website)) {
    errors.website = "Please enter a full URL beginning with http:// or https://.";
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
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      businessName: String(form.get("businessName") ?? "").trim(),
      website: String(form.get("website") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
    };
    const nextErrors = validate(data);
    const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);

    setErrors(nextErrors);
    setSubmitError("");

    if (firstInvalidField) {
      requestAnimationFrame(() => {
        document.getElementById(firstInvalidField)?.focus();
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLead(data);
      router.push("/thank-you");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We couldn’t send your request. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="book"
      aria-labelledby="form-heading"
      className="scroll-mt-6 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-deep-green/10 bg-white shadow-panel sm:rounded-[2.5rem] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="bg-deep-green px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <h2
            id="form-heading"
            className="text-4xl font-bold tracking-[-0.035em] sm:text-5xl"
          >
            Book the call
          </h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-white/80 sm:text-lg">
            One-to-one consultation. A customized strategy for your business.
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="text-sm font-bold text-ink">
                Full Name <span aria-hidden="true">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                placeholder="Your full name"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                onChange={() => clearFieldError("fullName")}
                className={inputClasses}
              />
              <ErrorMessage id="fullName-error">{errors.fullName}</ErrorMessage>
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-bold text-ink">
                Active Email <span aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="you@business.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                onChange={() => clearFieldError("email")}
                className={inputClasses}
              />
              <ErrorMessage id="email-error">{errors.email}</ErrorMessage>
            </div>

            <div>
              <label htmlFor="whatsapp" className="text-sm font-bold text-ink">
                WhatsApp Number <span aria-hidden="true">*</span>
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="+9779812345678"
                aria-invalid={Boolean(errors.whatsapp)}
                aria-describedby={
                  errors.whatsapp ? "whatsapp-error" : undefined
                }
                onChange={() => clearFieldError("whatsapp")}
                className={inputClasses}
              />
              <ErrorMessage id="whatsapp-error">{errors.whatsapp}</ErrorMessage>
            </div>

            <div>
              <label
                htmlFor="businessName"
                className="text-sm font-bold text-ink"
              >
                Business Name <span aria-hidden="true">*</span>
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                autoComplete="organization"
                required
                placeholder="Your hotel or business"
                aria-invalid={Boolean(errors.businessName)}
                aria-describedby={
                  errors.businessName ? "businessName-error" : undefined
                }
                onChange={() => clearFieldError("businessName")}
                className={inputClasses}
              />
              <ErrorMessage id="businessName-error">
                {errors.businessName}
              </ErrorMessage>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="website" className="text-sm font-bold text-ink">
              Website or Facebook URL
              <span className="ml-1 font-normal text-muted">(optional)</span>
            </label>
            <input
              id="website"
              name="website"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://"
              aria-invalid={Boolean(errors.website)}
              aria-describedby={errors.website ? "website-error" : undefined}
              onChange={() => clearFieldError("website")}
              className={inputClasses}
            />
            <ErrorMessage id="website-error">{errors.website}</ErrorMessage>
          </div>

          <div className="mt-6">
            <label htmlFor="message" className="text-sm font-bold text-ink">
              Anything You Want to Say
              <span className="ml-1 font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tell us anything useful before the call"
              className={`${inputClasses} resize-y`}
            />
          </div>

          {submitError ? (
            <p
              role="alert"
              className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800"
            >
              {submitError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="mt-7 min-h-14 w-full rounded-full bg-primary px-6 py-4 text-base font-bold text-white shadow-button transition duration-200 hover:-translate-y-0.5 hover:bg-deep-green hover:shadow-lg focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary/30 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isSubmitting ? "Sending…" : CTA_TEXT}
          </button>
          <p className="mt-4 text-center text-sm text-muted">
            We respect your privacy. No spam.
          </p>
        </form>
      </div>
    </section>
  );
}
