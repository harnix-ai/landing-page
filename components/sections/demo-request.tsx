"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useSite } from "@/components/providers";
import { btn } from "@/components/ui";
import { companySizes } from "@/lib/copy";
import { HONEYPOT_FIELD, type PartnerField } from "@/lib/validation";
import { usePartnerForm } from "@/lib/use-partner-form";

const fieldBase =
  "h-[50px] rounded-xl border bg-night px-4 text-[16px] font-normal outline-none transition-colors placeholder:text-on-night-faint focus:border-accent-on-night max-md:h-[52px] max-md:focus:border-accent-focus";
const inputClass = `${fieldBase} text-white`;

const STEP_FIELDS: PartnerField[][] = [["name", "phone"], ["email", "company"], ["want"]];

/**
 * "Sẵn sàng giao việc cho AI?" — the demo request, which is also the design
 * partner application. Posts to `/api/partner`, which validates again and
 * forwards the lead to `LEADS_WEBHOOK_URL` (the leads Sheet).
 *
 * Desktop keeps the single-page form. Below 768px it is a 3-step wizard that
 * still submits the same payload.
 */
export function DemoRequest() {
  const { c } = useSite();
  const d = c.demo;
  const form = usePartnerForm();

  return (
    <section id="demo" className="relative overflow-hidden bg-night">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[200px] -bottom-[200px] h-[520px] w-[520px] rounded-full bg-accent opacity-[0.16] blur-[110px] md:-bottom-[300px] md:h-[800px] md:w-[800px] md:blur-[140px]"
      />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-7 px-5 py-16 md:grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] md:gap-[clamp(40px,6vw,80px)] md:py-[clamp(72px,10vw,140px)]">
        <div className="flex flex-col gap-4 md:gap-6">
          <h2 className="m-0 text-[44px] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance md:text-[clamp(40px,7vw,96px)]">
            {d.title}
          </h2>
          <p className="m-0 max-w-[460px] text-[16px] leading-[1.6] text-on-night3 md:text-[18px]">{d.sub}</p>
          <div className="hidden flex-col gap-[14px] border-t border-night-line pt-6 md:flex">
            <PartnerBlock />
          </div>
        </div>

        <div className="rounded-[24px] border border-night-line bg-night-card p-[22px] md:rounded-[28px] md:p-[clamp(24px,4vw,36px)]">
          {form.state === "success" ? (
            <Success form={form} />
          ) : (
            <>
              <div className="md:hidden">
                <MobileWizard form={form} />
              </div>
              <div className="hidden md:block">
                <DesktopForm form={form} />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-night-line pt-6 md:hidden">
          <PartnerBlock />
        </div>
      </div>
    </section>
  );
}

function PartnerBlock() {
  const { c } = useSite();
  const d = c.demo;
  return (
    <>
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
    </>
  );
}

function Success({ form }: { form: ReturnType<typeof usePartnerForm> }) {
  const { c } = useSite();
  const f = c.demo.form;
  return (
    <div role="status" className="flex flex-col items-center gap-3 px-1 py-8 text-center md:gap-[14px] md:px-2 md:py-12">
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-deep text-[26px] text-ok md:h-[60px] md:w-[60px] md:text-[28px]"
      >
        ✓
      </span>
      <strong className="text-[22px] font-bold md:text-[24px]">{f.successTitle}</strong>
      <span className="max-w-[340px] text-[15px] leading-[1.6] text-on-night3 md:text-[16px]">{f.successBody}</span>
      <button
        type="button"
        onClick={form.reset}
        className={`${btn.ghost} mt-2 h-11 cursor-pointer px-5 text-[15px]`}
      >
        {f.again}
      </button>
    </div>
  );
}

function DesktopForm({ form }: { form: ReturnType<typeof usePartnerForm> }) {
  const { c } = useSite();
  const f = c.demo.form;
  const { fieldId, errors, fieldProps, set, values, honeypot, setHoneypot, onSubmit, sending, state } = form;

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      {state === "server-error" && (
        <div role="alert" className="rounded-xl border border-err/50 bg-err/10 px-4 py-3 text-[15px] leading-[1.5] text-white">
          {f.serverError}
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <Field label={f.name} htmlFor={`${fieldId}-name`} error={errors.name && f.errors.name} errorId={`${fieldId}-name-error`}>
          <input {...fieldProps("name", inputClass)} autoComplete="name" onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label={f.phone} htmlFor={`${fieldId}-phone`} error={errors.phone && f.errors.phone} errorId={`${fieldId}-phone-error`}>
          <input
            {...fieldProps("phone", inputClass)}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
      </div>

      <Field label={f.email} htmlFor={`${fieldId}-email`} error={errors.email && f.errors.email} errorId={`${fieldId}-email-error`}>
        <input
          {...fieldProps("email", inputClass)}
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
            {...fieldProps("company", inputClass)}
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
          {...fieldProps("want", inputClass)}
          rows={3}
          placeholder={f.wantPlaceholder}
          onChange={(e) => set("want", e.target.value)}
          className={`${fieldProps("want", inputClass).className} h-auto resize-y py-[14px]`}
        />
      </Field>

      <Honeypot value={honeypot} onChange={setHoneypot} />

      <button type="submit" disabled={sending} className={`${btn.primary} h-[58px] cursor-pointer px-7 text-[17px]`}>
        {sending ? f.sending : f.submit}
      </button>
      <span className="text-center text-[13px] text-on-night-muted">{f.privacy}</span>
    </form>
  );
}

function MobileWizard({ form }: { form: ReturnType<typeof usePartnerForm> }) {
  const { c } = useSite();
  const f = c.demo.form;
  const m = c.mobile;
  const [step, setStep] = useState(0);
  const { idFor, errors, fieldProps, set, values, honeypot, setHoneypot, sending, state, validateFields, focusFirst, setErrors, submit } =
    form;
  const ns = "m";

  const label = m.formStep.replace("{N}", String(step + 1)).replace("{label}", m.formStepLabels[step] ?? "");
  const count = m.formCount.replace("{N}", String(step + 1));

  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateFields(STEP_FIELDS[step] ?? []);
    if (Object.keys(found).length) {
      setErrors(found);
      focusFirst(found, ns);
      return;
    }
    setErrors({});
    if (step < 2) {
      setStep((s) => s + 1);
      return;
    }
    void submit(ns);
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="mb-5 flex flex-col gap-2.5">
        <div className="flex justify-between text-[13px] font-semibold">
          <span className="text-white">{label}</span>
          <span className="text-on-night-muted">{count}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1 rounded-[2px] transition-colors duration-300 ${step >= i ? "bg-accent-on-night" : "bg-night-line2"}`}
            />
          ))}
        </div>
      </div>

      {state === "server-error" && (
        <div role="alert" className="rounded-xl border border-err/50 bg-err/10 px-4 py-3 text-[15px] leading-[1.5] text-white">
          {f.serverError}
        </div>
      )}

      <form noValidate onSubmit={advance} className="flex flex-col gap-3.5">
        {step === 0 && (
          <>
            <Field label={f.name} htmlFor={idFor("name", ns)} error={errors.name && f.errors.name} errorId={`${idFor("name", ns)}-error`}>
              <input {...fieldProps("name", inputClass, ns)} autoComplete="name" onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label={f.phone} htmlFor={idFor("phone", ns)} error={errors.phone && f.errors.phone} errorId={`${idFor("phone", ns)}-error`}>
              <input
                {...fieldProps("phone", inputClass, ns)}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
            <button type="submit" className={`${btn.primary} mt-1.5 h-14 cursor-pointer text-[17px]`}>
              {m.formNext}
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <Field label={f.email} htmlFor={idFor("email", ns)} error={errors.email && f.errors.email} errorId={`${idFor("email", ns)}-error`}>
              <input
                {...fieldProps("email", inputClass, ns)}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={f.emailPlaceholder}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <Field
              label={f.company}
              htmlFor={idFor("company", ns)}
              error={errors.company && f.errors.company}
              errorId={`${idFor("company", ns)}-error`}
            >
              <input
                {...fieldProps("company", inputClass, ns)}
                autoComplete="organization"
                onChange={(e) => set("company", e.target.value)}
              />
            </Field>
            <Field label={f.size} htmlFor={idFor("size", ns)}>
              <select
                id={idFor("size", ns)}
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
            <div className="mt-1.5 grid grid-cols-[auto_1fr] gap-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="h-14 cursor-pointer rounded-[14px] border border-night-line3 bg-transparent px-[18px] text-[16px] font-semibold text-white"
              >
                {m.formBack}
              </button>
              <button type="submit" className={`${btn.primary} h-14 cursor-pointer text-[17px]`}>
                {m.formNext}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Field label={f.want} htmlFor={idFor("want", ns)} error={errors.want && f.errors.want} errorId={`${idFor("want", ns)}-error`}>
              <textarea
                {...fieldProps("want", inputClass, ns)}
                rows={4}
                placeholder={f.wantPlaceholder}
                onChange={(e) => set("want", e.target.value)}
                className={`${fieldProps("want", inputClass, ns).className} h-auto resize-y py-[14px]`}
              />
            </Field>
            <Honeypot value={honeypot} onChange={setHoneypot} />
            <div className="mt-1.5 grid grid-cols-[auto_1fr] gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-14 cursor-pointer rounded-[14px] border border-night-line3 bg-transparent px-[18px] text-[16px] font-semibold text-white"
              >
                {m.formBack}
              </button>
              <button type="submit" disabled={sending} className={`${btn.primary} h-14 cursor-pointer text-[17px]`}>
                {sending ? f.sending : f.submit}
              </button>
            </div>
            <span className="text-center text-[13px] text-on-night-muted">{f.privacy}</span>
          </>
        )}
      </form>
    </div>
  );
}

function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
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
