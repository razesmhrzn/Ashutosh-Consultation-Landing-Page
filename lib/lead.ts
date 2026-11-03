export const FACILITY_TYPES = [
  "Hospital or clinic",
  "School or college",
  "Hotel or hospitality",
  "Commercial building",
  "Office",
  "Other facility",
] as const;

export type FacilityType = (typeof FACILITY_TYPES)[number];

export const FACILITY_CHALLENGES = [
  "Too many suppliers and invoices",
  "Stockouts or emergency purchases",
  "Inconsistent product quality",
  "High or unclear supply costs",
  "Cleaning machinery downtime",
  "Training and process gaps",
  "Other",
] as const;

export type FacilityChallenge = (typeof FACILITY_CHALLENGES)[number];

export type LeadFormData = {
  fullName: string;
  email: string;
  whatsapp: string;
  organization: string;
  facilityType: FacilityType | "";
  challenge: FacilityChallenge | "";
  contactConsent: boolean;
  companyWebsite: string;
};
