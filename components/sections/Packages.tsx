import { Check } from "lucide-react";
import { AnimatedReveal, RevealItem } from "@/components/ui/AnimatedReveal";
import { ButtonLink } from "@/components/ui/Button";
import { cardHover } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hasItems } from "@/lib/content";
import type { PackagesSection } from "@/types/content";

/** "Our sample packages" — home plan packages side by side (featured one highlighted). */
export function Packages({ data }: { data?: PackagesSection }) {
  if (!data || !hasItems(data.packages)) return null;
  return (
    <Section tone="muted" id="packages" labelledBy="packages-heading">
      <SectionHeading intro={data} id="packages-heading" align="center" />
      <AnimatedReveal
        as="ul"
        stagger={0.12}
        className="mt-12 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {data.packages.map((pkg) => {
          const featured = Boolean(pkg.featured);
          return (
            <RevealItem as="li" key={pkg.name} className="flex">
              <article
                aria-labelledby={`package-${pkg.name}`}
                className={`relative flex w-full flex-col rounded-card border p-7 shadow-card sm:p-8 ${cardHover} ${
                  featured
                    ? "border-inverse bg-inverse text-inverse-foreground"
                    : "border-border bg-surface"
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-medium tracking-wide text-accent-foreground">
                    {pkg.badge}
                  </span>
                )}
                <p
                  className={`text-xs font-medium tracking-eyebrow uppercase ${featured ? "text-inverse-accent" : "text-accent-ink"}`}
                >
                  {data.eyebrow ?? "Package"}
                </p>
                <h3
                  id={`package-${pkg.name}`}
                  className={`mt-2 text-4xl font-semibold ${featured ? "text-inverse-foreground" : ""}`}
                >
                  {pkg.name}
                </h3>
                {pkg.tagline && (
                  <p
                    className={`mt-1 text-sm ${featured ? "text-inverse-muted" : "text-muted-foreground"}`}
                  >
                    {pkg.tagline}
                  </p>
                )}
                <ul
                  className={`mt-6 flex-1 space-y-3 border-t pt-6 ${featured ? "border-inverse-foreground/15" : "border-border"}`}
                >
                  {pkg.items.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${featured ? "text-inverse-accent" : "text-accent-ink"}`}
                        aria-hidden="true"
                      />
                      <span className="text-sm">
                        <span className="font-medium">{item.title}</span>
                        {item.description && (
                          <span
                            className={`block ${featured ? "text-inverse-muted" : "text-muted-foreground"}`}
                          >
                            {item.description}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                {data.cta && (
                  <ButtonLink
                    href={data.cta.href}
                    variant={featured ? "accent" : "outline"}
                    className="mt-8 w-full"
                  >
                    {data.cta.label}
                  </ButtonLink>
                )}
              </article>
            </RevealItem>
          );
        })}
      </AnimatedReveal>
      {data.note && <p className="mt-8 text-center text-sm text-muted-foreground">{data.note}</p>}
    </Section>
  );
}
