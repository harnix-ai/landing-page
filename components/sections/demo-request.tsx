"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { useSite } from "@/components/providers";
import { btn } from "@/components/ui";
import { companySizes } from "@/lib/copy";
import {
  emptyPartnerSubmission,
  HONEYPOT_FIELD,
  validatePartner,
  type FieldErrors,
  type PartnerField,
  type PartnerSubmission,
} from "@/lib/validation";

type FormState = "idle" | "sending" | "success" | "server-error";

const fieldBase =
  "h-[50px] rounded-xl border bg-night px-4 text-[16px] font-normal outline-none transition-colors placeholder:text-on-night-faint focus:border-accent-on-night";
const inputClass = `${fieldBase} text-white`;

/**
 * "Sẵn sàng giao việc cho AI?" — the demo request, which is also the design
 * partner application. Posts to `/api/partner`, which validates again and
 * forwards the lead to `LEADS_WEBHOOK_URL` (the leads Sheet).
 */
export function DemoRequest() {
  const { c, lang } = useSite();
  const d = c.demo;
  const f = d.form;
  const fieldId = useId();
  const [values, setValues] = useState<PartnerSubmission>(emptyPartnerSubmission);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<FormState>("idle");

  const set = (key: keyof PartnerSubmission, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key as PartnerField]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const fieldProps = (key: PartnerField) => ({
    id: `${fieldId}-${key}`,
    name: key,
    value: values[key],
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${fieldId}-${key}-error` : undefined,
    className: `${inputClass} ${errors[key] ? "border-err" : "border-night-line2"}`,
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const found = validatePartner(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setState("idle");
      const first = (Object.keys(found) as PartnerField[])[0];
      document.getElementById(`${fieldId}-${first}`)?.focus();
      return;
    }

    setErrors({});
    setState("sending");
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          [HONEYPOT_FIELD]: honeypot,
          locale: lang,
          page: window.location.pathname,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      sendGAEvent("event", "generate_lead", { lead_type: "design_partner" });
      setState("success");
    } catch {
      setState("server-error");
    }
  }

  const sending = state === "sending";

  return (
    <section id="demo" className="relative overflow-hidden bg-night">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[200px] -bottom-[300px] h-[800px] w-[800px] rounded-full bg-accent opacity-[0.16] blur-[140px]"
      />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-start gap-[clamp(40px,6vw,80px)] px-5 py-[clamp(72px,10vw,140px)]">
        <div className="flex flex-col gap-6">
          <h2 className="m-0 text-[clamp(40px,7vw,96px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance">
            {d.title}
          </h2>
          <p className="m-0 max-w-[460px] text-[18px] leading-[1.6] text-on-night3">{d.sub}</p>
          <div className="flex flex-col gap-[14px] border-t border-night-line pt-6">
            <strong className="text-[18px] font-bold">{d.partnerTitle}</strong>
            <span className="text-[15px] leading-[1.55] text-on-night3">{d.partnerSub}</span>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {d.perks.map((perk) => (
                <li key={perk} className="rounded-full border border-night-line bg-night-card px-[14px] py-2 text-[14px]">
                  {perk}
                </li>
              ))}
            </ul>
            <span className="text-[14px] leading-[1.55] text-on-night-muted">{d.ask}</span>
          </div>
        </div>

        <div className="rounded-[28px] border border-night-line bg-night-card p-[clamp(24px,4vw,36px)]">
          {state === "success" ? (
            <div role="status" className="flex flex-col items-center gap-[14px] px-2 py-12 text-center">
              <span
                aria-hidden="true"
                className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-accent-deep text-[28px] text-ok"
              >
                ✓
              </span>
              <strong className="text-[24px] font-bold">{f.successTitle}</strong>
              <span className="max-w-[340px] text-[16px] leading-[1.6] text-on-night3">{f.successBody}</span>
              <button
                type="button"
                onClick={() => {
                  setValues(emptyPartnerSubmission);
                  setState("idle");
                }}
                className={`${btn.ghost} mt-2 h-11 cursor-pointer px-5 text-[15px]`}
              >
                {f.again}
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
              {state === "server-error" && (
                <div
                  role="alert"
                  className="rounded-xl border border-err/50 bg-err/10 px-4 py-3 text-[15px] leading-[1.5] text-white"
                >
                  {f.serverError}
                </div>
              )}

              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                <Field label={f.name} htmlFor={`${fieldId}-name`} error={errors.name && f.errors.name} errorId={`${fieldId}-name-error`}>
                  <input {...fieldProps("name")} autoComplete="name" onChange={(e) => set("name", e.target.value)} />
                </Field>
                <Field label={f.phone} htmlFor={`${fieldId}-phone`} error={errors.phone && f.errors.phone} errorId={`${fieldId}-phone-error`}>
                  <input
                    {...fieldProps("phone")}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </Field>
              </div>

              <Field label={f.email} htmlFor={`${fieldId}-email`} error={errors.email && f.errors.email} errorId={`${fieldId}-email-error`}>
                <input
                  {...fieldProps("email")}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={f.emailPlaceholder}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                <Field
                  label={f.company}
                  htmlFor={`${fieldId}-company`}
                  error={errors.company && f.errors.company}
                  errorId={`${fieldId}-company-error`}
                >
                  <input
                    {...fieldProps("company")}
                    autoComplete="organization"
                    onChange={(e) => set("company", e.target.value)}
                  />
                </Field>
                <Field label={f.size} htmlFor={`${fieldId}-size`}>
                  <select
                    id={`${fieldId}-size`}
                    name="size"
                    value={values.size}
                    onChange={(e) => set("size", e.target.value)}
                    className={`${fieldBase} border-night-line2 px-3 ${values.size ? "text-white" : "text-on-night-muted"}`}
                  >
                    <option value="">{f.sizeUnset}</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size} className="text-white">
                        {size.replace("-", "–")}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label={f.want} htmlFor={`${fieldId}-want`} error={errors.want && f.errors.want} errorId={`${fieldId}-want-error`}>
                <textarea
                  {...fieldProps("want")}
                  rows={3}
                  placeholder={f.wantPlaceholder}
                  onChange={(e) => set("want", e.target.value)}
                  className={`${fieldProps("want").className} h-auto resize-y py-[14px]`}
                />
              </Field>

              {/* Honeypot: off-screen, out of the tab order, hidden from assistive tech. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Leave this empty
                  <input
                    type="text"
                    name={HONEYPOT_FIELD}
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>

              <button type="submit" disabled={sending} className={`${btn.primary} h-[58px] cursor-pointer px-7 text-[17px]`}>
                {sending ? f.sending : f.submit}
              </button>
              <span className="text-center text-[13px] text-on-night-muted">{f.privacy}</span>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | false;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={htmlFor} className="text-[14px] font-semibold text-on-night2">
        {label}
      </label>
      {children}
      {error && (
        <span id={errorId} className="text-[13px] text-err-soft">
          {error}
        </span>
      )}
    </div>
  );
}
