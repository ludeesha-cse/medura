import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { BrandIcon, SOCIAL_LABELS } from "@/components/ui/BrandIcon";
import { Logo } from "@/components/ui/Logo";
import {
  getArchitecture,
  getContact,
  getEngineering,
  getSite,
  hasItems,
  mailtoHref,
  telHref,
  whatsappHref,
} from "@/lib/content";

/** Site footer — always on the deep ocean blue "inverse" band, in both themes. */
export function Footer() {
  const site = getSite();
  const contact = getContact();
  const services = [
    ...getArchitecture()
      .services.slice(0, 3)
      .map((s) => ({ ...s, href: "/architecture/" })),
    ...getEngineering()
      .services.slice(0, 3)
      .map((s) => ({ ...s, href: "/services/" })),
  ];
  // Build-time year; the site is rebuilt on every content change.
  const year = new Date().getFullYear();

  const heading =
    "mb-4 font-body text-xs font-medium tracking-eyebrow text-inverse-accent uppercase";
  const link =
    "text-inverse-muted transition-colors duration-(--duration-fast) hover:text-inverse-foreground";

  return (
    <footer className="bg-inverse text-inverse-foreground">
      <div className="mx-auto grid max-w-site gap-12 px-(--gutter) py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-4">
          <Link href="/" aria-label={`${site.name} — home`} className="inline-block rounded-md">
            <Logo variant="full" tone="on-dark" className="h-36 w-auto" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-inverse-muted">
            {site.seo.description}
          </p>
          {hasItems(contact.social) && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
              {contact.social.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.name} on ${SOCIAL_LABELS[s.platform]}`}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-inverse-foreground/25 text-inverse-foreground transition-colors duration-(--duration-fast) hover:border-inverse-accent hover:bg-inverse-accent hover:text-accent-foreground"
                  >
                    <BrandIcon name={s.platform} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick links */}
        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className={heading}>Quick links</h2>
          <ul className="space-y-2.5 text-sm">
            {site.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Services */}
        {services.length > 0 && (
          <div className="lg:col-span-3">
            <h2 className={heading}>Services</h2>
            <ul className="space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={s.href} className={link}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact */}
        <div className="lg:col-span-3">
          <h2 className={heading}>Contact</h2>
          <ul className="space-y-3.5 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-inverse-accent" aria-hidden="true" />
              <a href={telHref(contact.phone)} className={link}>
                {contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <BrandIcon name="whatsapp" className="mt-0.5 size-4 shrink-0 text-inverse-accent" />
              <a
                href={whatsappHref(contact.whatsapp, contact.form.messageGreeting)}
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                WhatsApp us
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-inverse-accent" aria-hidden="true" />
              <a href={mailtoHref(contact.email)} className={`${link} break-all`}>
                {contact.email}
              </a>
            </li>
            {hasItems(contact.address) && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-inverse-accent" aria-hidden="true" />
                <address className="text-inverse-muted not-italic">
                  {contact.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            )}
            {hasItems(contact.workingHours) && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-inverse-accent" aria-hidden="true" />
                <span className="text-inverse-muted">
                  {contact.workingHours[0].days}: {contact.workingHours[0].hours}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-inverse-foreground/15">
        <div className="mx-auto flex max-w-site flex-col gap-2 px-(--gutter) py-6 text-xs text-inverse-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="tracking-eyebrow uppercase">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
