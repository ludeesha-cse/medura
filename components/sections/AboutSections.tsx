import { Clock, Eye, Mail, MapPin, Phone, Target } from "lucide-react";
import { ContactForm, type ServiceOption } from "@/components/sections/ContactForm";
import { AnimatedReveal, RevealItem } from "@/components/ui/AnimatedReveal";
import { BrandIcon, SOCIAL_LABELS } from "@/components/ui/BrandIcon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { hasItems, hasText, mailtoHref, telHref, whatsappHref } from "@/lib/content";
import { getIcon } from "@/lib/icons";
import type { AboutContent, ContactContent } from "@/types/content";
import { cardHover, imageZoom } from "@/components/ui/Card";

/* ------------------------------------------------------------------ Story */

export function Story({ story }: { story: AboutContent["story"] }) {
  if (!hasItems(story.paragraphs)) return null;
  return (
    <Section labelledBy="story-heading">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            intro={{ eyebrow: story.eyebrow, heading: story.heading }}
            id="story-heading"
          />
          <AnimatedReveal
            delay={0.1}
            className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground"
          >
            {story.paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </AnimatedReveal>
        </div>
        {story.image && (
          <AnimatedReveal x={40} y={0} className="relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-card shadow-card-hover">
              <SmartImage
                image={story.image}
                fallbackAlt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div
              className="absolute -bottom-5 -left-5 -z-10 h-1/2 w-1/2 rounded-card bg-accent/30"
              aria-hidden="true"
            />
          </AnimatedReveal>
        )}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------- Mission & vision */

export function MissionVision({ mission, vision }: { mission?: string; vision?: string }) {
  const items = [
    hasText(mission) && { title: "Our mission", text: mission, Icon: Target },
    hasText(vision) && { title: "Our vision", text: vision, Icon: Eye },
  ].filter(Boolean) as { title: string; text: string; Icon: typeof Target }[];
  if (!items.length) return null;
  return (
    <Section tone="muted" labelledBy="mission-heading">
      <h2 id="mission-heading" className="sr-only">
        Mission and vision
      </h2>
      <AnimatedReveal
        stagger={0.15}
        className={`grid gap-6 ${items.length > 1 ? "md:grid-cols-2" : ""}`}
      >
        {items.map(({ title, text, Icon }, i) => (
          <RevealItem
            key={title}
            className={`rounded-card p-8 shadow-card sm:p-10 ${
              i === 0 ? "bg-inverse text-inverse-foreground" : "border border-border bg-surface"
            }`}
          >
            <Icon
              className={`size-8 ${i === 0 ? "text-inverse-accent" : "text-accent-ink"}`}
              aria-hidden="true"
            />
            <h3
              className={`mt-5 text-3xl font-semibold ${i === 0 ? "text-inverse-foreground" : ""}`}
            >
              {title}
            </h3>
            <p
              className={`mt-3 font-heading text-2xl leading-snug italic ${i === 0 ? "text-inverse-muted" : "text-muted-foreground"}`}
            >
              “{text}”
            </p>
          </RevealItem>
        ))}
      </AnimatedReveal>
    </Section>
  );
}

/* ----------------------------------------------------------------- Values */

export function Values({
  values,
  intro = { heading: "Our values" },
}: {
  values: AboutContent["values"];
  intro?: AboutContent["valuesIntro"];
}) {
  if (!hasItems(values)) return null;
  return (
    <Section labelledBy="values-heading">
      <SectionHeading intro={intro} id="values-heading" align="center" />
      <AnimatedReveal
        as="ul"
        stagger={0.1}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {values.map((v) => {
          const Icon = getIcon(v.icon);
          return (
            <RevealItem
              as="li"
              key={v.title}
              className={`rounded-card border border-border bg-surface p-7 text-center shadow-card ${cardHover}`}
            >
              <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-2xl font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
            </RevealItem>
          );
        })}
      </AnimatedReveal>
    </Section>
  );
}

/* ------------------------------------------------------------------- Team */

export function Team({ team }: { team: AboutContent["team"] }) {
  if (!team || !hasItems(team.members)) return null;
  return (
    <Section tone="muted" labelledBy="team-heading">
      <SectionHeading intro={team} id="team-heading" align="center" />
      <AnimatedReveal
        as="ul"
        stagger={0.1}
        className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {team.members.map((m) => (
          <RevealItem as="li" key={m.name} className="group text-center">
            <div className="relative mx-auto aspect-square w-full max-w-64 overflow-hidden rounded-full border-4 border-surface shadow-card">
              <SmartImage
                image={m.photo}
                fallbackAlt={`Portrait of ${m.name}`}
                fill
                sizes="256px"
                className={`object-cover ${imageZoom}`}
              />
            </div>
            <h3 className="mt-5 text-2xl font-semibold">{m.name}</h3>
            <p className="mt-1 text-xs font-medium tracking-eyebrow text-accent-ink uppercase">
              {m.role}
            </p>
            {m.bio && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>}
          </RevealItem>
        ))}
      </AnimatedReveal>
    </Section>
  );
}

/* ---------------------------------------------------------------- Contact */

export function ContactSection({
  contact,
  services,
}: {
  contact: ContactContent;
  services: ServiceOption[];
}) {
  const row = "flex gap-4";
  const iconWrap =
    "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink";
  const linkCls = "font-medium text-heading hover:text-accent-ink hover:underline";

  return (
    <Section id="contact" labelledBy="contact-heading" className="scroll-mt-(--navbar-height)">
      <SectionHeading intro={contact.intro} id="contact-heading" />

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Details */}
        <AnimatedReveal className="space-y-8 lg:col-span-5">
          <ul className="space-y-6">
            <li className={row}>
              <span className={iconWrap}>
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Call us</p>
                <a href={telHref(contact.phone)} className={linkCls}>
                  {contact.phone}
                </a>
              </div>
            </li>
            <li className={row}>
              <span className={iconWrap}>
                <BrandIcon name="whatsapp" className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp</p>
                <a
                  href={whatsappHref(contact.whatsapp, contact.form.messageGreeting)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  Chat with us
                </a>
              </div>
            </li>
            <li className={row}>
              <span className={iconWrap}>
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a href={mailtoHref(contact.email)} className={`${linkCls} break-all`}>
                  {contact.email}
                </a>
              </div>
            </li>
            {hasItems(contact.address) && (
              <li className={row}>
                <span className={iconWrap}>
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Visit our studio</p>
                  <address className="font-medium text-heading not-italic">
                    {contact.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </li>
            )}
          </ul>

          {hasItems(contact.workingHours) && (
            <div className="rounded-card border border-border bg-surface p-6">
              <h3 className="flex items-center gap-2 font-body text-sm font-medium tracking-eyebrow text-accent-ink uppercase">
                <Clock className="size-4" aria-hidden="true" />
                Working hours
              </h3>
              <dl className="mt-4 divide-y divide-border text-sm">
                {contact.workingHours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-muted-foreground">{h.days}</dt>
                    <dd className="text-right font-medium text-heading">{h.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {hasItems(contact.social) && (
            <ul className="flex flex-wrap gap-2" aria-label="Social media">
              {contact.social.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[s.platform]}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-heading transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <BrandIcon name={s.platform} className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </AnimatedReveal>

        {/* Form */}
        <AnimatedReveal delay={0.1} className="lg:col-span-7">
          <div className="rounded-card border border-border bg-surface p-6 shadow-card sm:p-8">
            <h3 className="text-3xl font-semibold">{contact.form.heading}</h3>
            {contact.form.text && <p className="mt-2 text-muted-foreground">{contact.form.text}</p>}
            <div className="mt-6">
              <ContactForm
                services={services}
                whatsapp={contact.whatsapp}
                email={contact.email}
                greeting={contact.form.messageGreeting}
                emailSubject={contact.form.emailSubject}
              />
            </div>
          </div>
        </AnimatedReveal>
      </div>

      {hasText(contact.mapEmbedUrl) && (
        <AnimatedReveal className="mt-12">
          <div className="relative aspect-4/3 overflow-hidden rounded-card border border-border shadow-card sm:aspect-21/9">
            <iframe
              src={contact.mapEmbedUrl}
              title={`Map showing ${contact.address.join(", ")}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 size-full border-0 grayscale-[25%] dark:hue-rotate-180 dark:invert-[0.9]"
            />
          </div>
        </AnimatedReveal>
      )}
    </Section>
  );
}
