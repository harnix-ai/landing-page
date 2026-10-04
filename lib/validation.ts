import type { Lang } from "@/lib/copy";

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Loose on purpose: Vietnamese mobiles (0912 345 678), landlines with an
 * area code, and international numbers (+84 912-345-678) all pass. What it
 * catches is the obvious mistake — letters, or too few digits to dial.
 */
const PHONE_ALLOWED_RE = /^\+?[\d\s().-]+$/;
const PHONE_MIN_DIGITS = 8;
const PHONE_MAX_DIGITS = 15;

export type PartnerField = "name" | "phone" | "email" | "company" | "want";

/**
 * The demo-request lead. These keys are the payload delivered to
 * `LEADS_WEBHOOK_URL` (the leads Sheet), so renaming one renames a column.
 */
export type PartnerSubmission = {
  name: string;
  phone: string;
  email: string;
  company: string;
  size: string;
  want: string;
};

export type FieldErrors = Partial<Record<PartnerField, true>>;

export const emptyPartnerSubmission: PartnerSubmission = {
  name: "",
  phone: "",
  email: "",
  company: "",
  size: "",
  want: "",
};

export function isValidEmail(value: string) {
  return EMAIL_RE.test(value.trim());
}

export function isValidPhone(value: string) {
  const trimmed = value.trim();
  if (!PHONE_ALLOWED_RE.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "").length;
  return digits >= PHONE_MIN_DIGITS && digits <= PHONE_MAX_DIGITS;
}

/** Shared by the form and the route handler so both agree on what is valid. */
export function validatePartner(values: PartnerSubmission): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = true;
  if (!isValidPhone(values.phone)) errors.phone = true;
  if (!isValidEmail(values.email)) errors.email = true;
  if (!values.company.trim()) errors.company = true;
  if (!values.want.trim()) errors.want = true;
  return errors;
}

function asRecord(body: unknown): Record<string, unknown> {
  return (body ?? {}) as Record<string, unknown>;
}

function str(raw: Record<string, unknown>, key: string): string {
  return typeof raw[key] === "string" ? (raw[key] as string) : "";
}

/** Narrow an unknown JSON body into the submission shape, trimmed. */
export function readPartnerSubmission(body: unknown): PartnerSubmission {
  const raw = asRecord(body);
  return {
    name: str(raw, "name").trim(),
    phone: str(raw, "phone").trim(),
    email: str(raw, "email").trim(),
    company: str(raw, "company").trim(),
    size: str(raw, "size"),
    want: str(raw, "want").trim(),
  };
}

/**
 * Every lead form carries a honeypot field alongside its real fields. It is
 * hidden from sighted and assistive-tech users alike (see the `hp_confirm`
 * input in the form component) — a human never fills it, so any non-empty
 * value marks the submission as automated.
 */
export const HONEYPOT_FIELD = "hp_confirm";

export function isHoneypotTriggered(body: unknown): boolean {
  return str(asRecord(body), HONEYPOT_FIELD).trim().length > 0;
}

/** Max lengths enforced server-side, independent of the client's own UX validation. */
export const LIMITS = {
  name: 120,
  phone: 32,
  email: 254,
  company: 160,
  want: 2000,
  page: 200,
} as const;

export function exceedsLimits(
  values: Partial<Record<keyof typeof LIMITS, string>>,
): boolean {
  return Object.entries(values).some(([key, value]) => {
    if (value === undefined) return false;
    return value.length > LIMITS[key as keyof typeof LIMITS];
  });
}

export type LeadContext = { locale: Lang; page: string };

/**
 * `locale` and `page` describe where the submission came from — the client
 * reads them off `useSite()` / `window.location` at submit time. Both are
 * clamped/defaulted here rather than trusted, since the request body is
 * attacker-controlled.
 */
export function readLeadContext(body: unknown): LeadContext {
  const raw = asRecord(body);
  const locale: Lang = raw.locale === "en" ? "en" : "vi";
  const rawPage = str(raw, "page").trim().slice(0, LIMITS.page);
  const page = rawPage.startsWith("/") ? rawPage : "/";
  return { locale, page };
}
