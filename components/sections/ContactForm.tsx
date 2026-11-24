"use client";

import { Mail, Send } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { buttonClasses } from "@/components/ui/Button";
import { mailtoHref, whatsappHref } from "@/lib/content";

export interface ServiceOption {
  id: string;
  title: string;
  group: string;
}

type Field = "name" | "phone" | "email" | "service" | "message";
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your name.";
  const digits = v.phone.replace(/\D/g, "");
  if (!v.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (!/^[\d\s+()-]+$/.test(v.phone) || digits.length < 9 || digits.length > 15)
    errors.phone = "Please enter a valid phone number, e.g. 077 123 4567.";
  if (v.email.trim() && !EMAIL_RE.test(v.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10)
    errors.message = "Please tell us a little about your project (at least 10 characters).";
  return errors;
}

/**
 * Contact form with no backend: validates, then opens WhatsApp (wa.me) or the visitor's
 * email app (mailto:) with the message pre-filled. Nothing is stored or sent by the site.
 */
export function ContactForm({
  services,
  whatsapp,
  email,
  greeting,
  emailSubject,
}: {
  services: ServiceOption[];
  whatsapp: string;
  email: string;
  greeting: string;
  emailSubject: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const uid = useId();
  const groups = [...new Set(services.map((s) => s.group))];

  // Pre-select a service when arriving from "Discuss this service" (/about/?service=id#contact).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("service");
    if (id && serviceRef.current && services.some((s) => s.id === id)) {
      serviceRef.current.value = id;
    }
  }, [services]);

  const read = (): Record<Field, string> => {
    const data = new FormData(formRef.current!);
    const get = (k: Field) => String(data.get(k) ?? "");
    return {
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      service: get("service"),
      message: get("message"),
    };
  };

  const compose = (v: Record<Field, string>) => {
    const service = services.find((s) => s.id === v.service)?.title;
    const email = v.email.trim();
    return [
      greeting,
      "",
      `Name: ${v.name.trim()}`,
      `Phone: ${v.phone.trim()}`,
      ...(email ? [`Email: ${email}`] : []),
      ...(service ? [`Service: ${service}`] : []),
      "",
      "Message:",
      v.message.trim(),
    ].join("\n");
  };

  const submit = (channel: "whatsapp" | "email") => {
    const values = read();
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      setStatus(`Please fix ${Object.keys(found).length} field(s) before sending.`);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const body = compose(values);
    if (channel === "whatsapp") {
      window.open(whatsappHref(whatsapp, body), "_blank", "noopener,noreferrer");
      setStatus("WhatsApp opened in a new tab — just press send there.");
    } else {
      const service = services.find((s) => s.id === values.service)?.title;
      window.location.href = mailtoHref(
        email,
        service ? `${emailSubject} — ${service}` : emailSubject,
        body,
      );
      setStatus("Your email app should open with the message ready — just press send.");
    }
  };

  const field = (name: Field) => ({
    id: `${uid}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
    onChange: () => errors[name] && setErrors((e) => ({ ...e, [name]: undefined })),
    className: `mt-2 block w-full rounded-button border bg-surface px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring ${
      errors[name] ? "border-danger" : "border-border-strong"
    }`,
  });

  const label = (name: Field, text: string, required = false) => (
    <label htmlFor={`${uid}-${name}`} className="text-sm font-medium text-heading">
      {text}
      {required ? (
        <span className="text-danger" aria-hidden="true">
          {" "}
          *
        </span>
      ) : (
        <span className="text-muted-foreground"> (optional)</span>
      )}
    </label>
  );

  const error = (name: Field) =>
    errors[name] ? (
      <p id={`${uid}-${name}-error`} className="mt-1.5 text-sm text-danger">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit("whatsapp");
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      <div>
        {label("name", "Name", true)}
        <input
          {...field("name")}
          type="text"
          autoComplete="name"
          required
          placeholder="Your name"
        />
        {error("name")}
      </div>
      <div>
        {label("phone", "Phone", true)}
        <input
          {...field("phone")}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          placeholder="077 123 4567"
        />
        {error("phone")}
      </div>
      <div>
        {label("email", "Email")}
        <input
          {...field("email")}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        {error("email")}
      </div>
      <div>
        {label("service", "Service of interest")}
        <select {...field("service")} ref={serviceRef} defaultValue="">
          <option value="">General enquiry</option>
          {groups.map((g) => (
            <optgroup key={g} label={g}>
              {services
                .filter((s) => s.group === g)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        {error("service")}
      </div>
      <div className="sm:col-span-2">
        {label("message", "Message", true)}
        <textarea
          {...field("message")}
          rows={5}
          required
          placeholder="Tell us about your land, building type, location and timeline…"
        />
        {error("message")}
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <button
          type="button"
          onClick={() => submit("whatsapp")}
          className={`${buttonClasses("primary", "lg")} flex-1`}
        >
          <BrandIcon name="whatsapp" className="size-5" />
          Send via WhatsApp
        </button>
        <button
          type="button"
          onClick={() => submit("email")}
          className={`${buttonClasses("outline", "lg")} flex-1`}
        >
          <Mail className="size-5" aria-hidden="true" />
          Send via Email
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={`flex items-center gap-2 text-sm sm:col-span-2 ${
          Object.keys(errors).some((k) => errors[k as Field]) ? "text-danger" : "text-success"
        } ${status ? "" : "sr-only"}`}
      >
        {status && <Send className="size-4 shrink-0" aria-hidden="true" />}
        {status}
      </p>
      <p className="text-xs text-muted-foreground sm:col-span-2">
        <span className="text-danger" aria-hidden="true">
          *
        </span>{" "}
        Required. Your details go straight to us through WhatsApp or your own email app — this
        website doesn&apos;t store them.
      </p>
    </form>
  );
}
