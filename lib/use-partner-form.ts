"use client";

import { useId, useState, type FormEvent } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { useSite } from "@/components/providers";
import {
  emptyPartnerSubmission,
  HONEYPOT_FIELD,
  validatePartner,
  type FieldErrors,
  type PartnerField,
  type PartnerSubmission,
} from "@/lib/validation";

export type FormState = "idle" | "sending" | "success" | "server-error";

/**
 * Shared demo-request submit state. Desktop (one page) and mobile (3 steps)
 * both post the same `/api/partner` envelope — do not change the payload.
 */
export function usePartnerForm() {
  const { lang } = useSite();
  const fieldId = useId();
  const [values, setValues] = useState<PartnerSubmission>(emptyPartnerSubmission);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<FormState>("idle");

  const set = (key: keyof PartnerSubmission, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key as PartnerField]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const idFor = (key: string, ns = "") => `${fieldId}${ns ? `-${ns}` : ""}-${key}`;

  const fieldProps = (key: PartnerField, className: string, ns = "") => ({
    id: idFor(key, ns),
    name: key,
    value: values[key],
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${idFor(key, ns)}-error` : undefined,
    className: `${className} ${errors[key] ? "border-err" : "border-night-line2"}`,
  });

  function validateFields(keys: PartnerField[]): FieldErrors {
    const all = validatePartner(values);
    const found: FieldErrors = {};
    for (const key of keys) {
      if (all[key]) found[key] = true;
    }
    return found;
  }

  function focusFirst(found: FieldErrors, ns = "") {
    const first = (Object.keys(found) as PartnerField[])[0];
    if (first) document.getElementById(idFor(first, ns))?.focus();
  }

  async function submit(ns = "") {
    if (state === "sending") return false;

    const found = validatePartner(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setState("idle");
      focusFirst(found, ns);
      return false;
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
      return true;
    } catch {
      setState("server-error");
      return false;
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit();
  }

  const reset = () => {
    setValues(emptyPartnerSubmission);
    setErrors({});
    setState("idle");
  };

  return {
    values,
    set,
    honeypot,
    setHoneypot,
    errors,
    setErrors,
    state,
    setState,
    fieldId,
    idFor,
    fieldProps,
    validateFields,
    focusFirst,
    submit,
    onSubmit,
    reset,
    sending: state === "sending",
  };
}
