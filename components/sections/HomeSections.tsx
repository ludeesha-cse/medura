import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { AnimatedReveal, RevealItem } from "@/components/ui/AnimatedReveal";
import { ButtonLink, type ButtonVariant } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { hasItems, projectImages } from "@/lib/content";
import { getIcon } from "@/lib/icons";
import type { CallToAction, HomeContent, Project } from "@/types/content";
import { cardHover, imageZoom } from "@/components/ui/Card";

const ctaVariant = (v?: CallToAction["variant"], onDark = false): ButtonVariant =>
  v === "outline"
    ? onDark
      ? "outline-on-dark"
      : "outline"
    : v === "accent"
      ? "accent"
      : "primary";

/* ------------------------------------------------------------------ Stats */

export function Stats({ stats }: { stats: HomeContent["stats"] }) {
  if (!hasItems(stats)) return null;
  return (
    <section
      id="home-content"
      aria-label="Medura in numbers"
      className="border-b border-border bg-surface"
    >
      <AnimatedReveal
        as="ul"
        stagger={0.1}
        className="mx-auto grid max-w-site grid-cols-2 px-(--gutter) lg:grid-cols-4"
      >
        {stats.map((stat, i) => (
          <RevealItem
            as="li"
            key={stat.label}
            className={`flex flex-col items-center px-4 py-10 text-center sm:py-14 ${
              i % 2 === 1 ? "border-l border-border" : ""
            } ${i >= 2 ? "border-t border-border lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <CountUp
              value={stat.value}
              suffix={stat.suffix}
              className="font-heading text-5xl font-semibold text-heading sm:text-6xl"
            />
            <span className="mt-2 text-xs font-medium tracking-eyebrow text-muted-foreground uppercase">
              {stat.label}
            </span>
          </RevealItem>
        ))}
      </AnimatedReveal>
    </section>
  );
}

/* -------------------------------------------------------- Services preview */

export function ServicesPreview({ data }: { data: HomeContent["servicesPreview"] }) {
  if (!data || !hasItems(data.cards)) return null;
  return (
    <Section labelledBy="services-preview-heading">
      <SectionHeading intro={data} id="services-preview-heading" />
      <AnimatedReveal stagger={0.15} className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
        {data.cards.map((card) => {
          const Icon = getIcon(card.icon);
          return (
            <RevealItem key={card.href + card.title}>
              <Link
                href={card.href}
                className={`group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card ${cardHover}`}
              >
                <div className="relative aspect-16/9 overflow-hidden">
                  <SmartImage
                    image={card.image}
                    fallbackAlt={card.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={`object-cover ${imageZoom}`}
                  />
                  <span className="absolute top-4 left-4 inline-flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-card">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="text-3xl font-semibold">{card.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-accent-ink">
                    Explore
                    <ArrowRight
                      className="size-4 transition-transform duration-(--duration-base) group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            </RevealItem>
          );
        })}
      </AnimatedReveal>
    </Section>
  );
}

/* ------------------------------------------------------- Featured projects */

export function FeaturedProjects({
  data,
  projects,
}: {
  data: HomeContent["featuredProjects"];
  projects: Project[];
}) {
  if (!data || !projects.length) return null;
  return (
    <Section tone="muted" labelledBy="featured-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading intro={data} id="featured-heading" />
        {data.cta && (
          <AnimatedReveal>
            <ButtonLink href={data.cta.href} variant="outline">
              {data.cta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </AnimatedReveal>
        )}
      </div>
      <AnimatedReveal
        stagger={0.12}
        as="ul"
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((p, i) => (
          <RevealItem as="li" key={p.id} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
            <Link
              href={`/projects/#${p.id}`}
              className={`group relative block overflow-hidden rounded-card bg-inverse shadow-card ${cardHover}`}
            >
              <div className="relative aspect-4/5 sm:aspect-4/3 lg:aspect-4/5">
                <SmartImage
                  image={projectImages(p)[0]}
                  fallbackAlt={p.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={`object-cover ${imageZoom}`}
                />
                <div className="absolute inset-0 bg-linear-to-t from-overlay-from from-15% via-overlay-from/70 via-50% to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-inverse-foreground">
                  <p className="text-xs font-medium tracking-eyebrow text-inverse-accent uppercase">
                    {p.category}
                    {p.year ? ` · ${p.year}` : ""}
                  </p>
                  <h3 className="mt-2 flex items-start justify-between gap-3 text-2xl font-semibold text-inverse-foreground sm:text-3xl">
                    {p.title}
                    <ArrowUpRight
                      className="mt-1 size-5 shrink-0 transition-transform duration-(--duration-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-inverse-muted">
                    <MapPin className="size-4" aria-hidden="true" />
                    {p.location}
                  </p>
                </div>
              </div>
            </Link>
          </RevealItem>
        ))}
      </AnimatedReveal>
    </Section>
  );
}

/* ---------------------------------------------------------- Why choose us */

export function WhyChooseUs({ data }: { data: HomeContent["whyChooseUs"] }) {
  if (!data || !hasItems(data.points)) return null;
  return (
    <Section labelledBy="why-heading">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {data.image && (
          <AnimatedReveal x={-40} y={0} className="lg:col-span-5">
            <div className="relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-card shadow-card-hover">
                <SmartImage
                  image={data.image}
                  fallbackAlt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute -right-4 -bottom-4 -z-10 h-2/3 w-2/3 rounded-card border-2 border-accent/60 sm:-right-6 sm:-bottom-6"
                aria-hidden="true"
              />
            </div>
          </AnimatedReveal>
        )}
        <div className={data.image ? "lg:col-span-7" : "lg:col-span-12"}>
          <SectionHeading intro={data} id="why-heading" />
          <AnimatedReveal stagger={0.1} as="ul" className="mt-10 grid gap-8 sm:grid-cols-2">
            {data.points.map((point, i) => {
              const Icon = getIcon(point.icon);
              return (
                <RevealItem as="li" key={point.title} className="flex gap-4">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-accent-ink shadow-sm">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading text-sm text-muted-foreground">0{i + 1}</p>
                    <h3 className="text-2xl font-semibold">{point.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </AnimatedReveal>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- CTA banner */

export function CtaBanner({ data }: { data: HomeContent["ctaBanner"] }) {
  if (!data) return null;
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden bg-inverse text-inverse-foreground"
    >
      {data.image && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <SmartImage
            image={data.image}
            fallbackAlt=""
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-linear-to-r from-overlay-from to-overlay-to" />
        </div>
      )}
      <AnimatedReveal className="mx-auto flex max-w-site flex-col items-start gap-8 px-(--gutter) py-20 sm:py-24 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2
            id="cta-heading"
            className="text-4xl leading-tight font-semibold text-inverse-foreground sm:text-5xl"
          >
            {data.heading}
          </h2>
          {data.text && (
            <p className="mt-4 text-lg leading-relaxed text-inverse-muted">{data.text}</p>
          )}
        </div>
        {hasItems(data.ctas) && (
          <div className="flex flex-wrap gap-3">
            {data.ctas.map((cta) => (
              <ButtonLink
                key={cta.href + cta.label}
                href={cta.href}
                variant={ctaVariant(cta.variant, true)}
                size="lg"
              >
                {cta.label}
              </ButtonLink>
            ))}
          </div>
        )}
      </AnimatedReveal>
    </section>
  );
}
