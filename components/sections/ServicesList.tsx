import { ArrowRight, Check, Phone } from "lucide-react";
import Link from "next/link";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ButtonLink } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { SmartImage } from "@/components/ui/SmartImage";
import { getIcon } from "@/lib/icons";
import type { Service, ServicesPage } from "@/types/content";
import { imageZoom } from "@/components/ui/Card";

/**
 * Engineering & other services — deliberately different from the Architecture grid:
 * a sticky side panel with a jump list, and a numbered, icon-led list of full-width rows.
 */
export function ServicesList({
  services,
  helpBox,
  phone,
}: {
  services: Service[];
  helpBox?: ServicesPage["helpBox"];
  phone?: { label: string; href: string };
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-[calc(var(--navbar-height)+2rem)]">
          <AnimatedReveal className="rounded-card bg-inverse p-8 text-inverse-foreground shadow-card">
            <p className="text-xs font-medium tracking-eyebrow text-inverse-accent uppercase">
              {services.length} services
            </p>
            <nav aria-label="Jump to a service" className="mt-5">
              <ol className="space-y-1">
                {services.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="group flex items-baseline gap-3 rounded-md py-1.5 text-inverse-muted transition-colors hover:text-inverse-foreground"
                    >
                      <span className="font-heading text-sm text-inverse-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm">{s.title}</span>
                      <ArrowRight
                        className="ml-auto size-3.5 -translate-x-1 opacity-0 transition-[opacity,transform] group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            {helpBox && (
              <div className="mt-8 border-t border-inverse-foreground/15 pt-6">
                <p className="font-heading text-2xl font-semibold text-inverse-foreground">
                  {helpBox.heading}
                </p>
                {helpBox.text && <p className="mt-2 text-sm text-inverse-muted">{helpBox.text}</p>}
                <div className="mt-5 flex flex-wrap gap-3">
                  {helpBox.cta && (
                    <ButtonLink href={helpBox.cta.href} variant="accent" size="sm">
                      {helpBox.cta.label}
                    </ButtonLink>
                  )}
                  {phone && (
                    <ButtonLink href={phone.href} variant="outline-on-dark" size="sm">
                      <Phone className="size-4" aria-hidden="true" />
                      Call
                    </ButtonLink>
                  )}
                </div>
              </div>
            )}
          </AnimatedReveal>
        </div>
      </aside>

      <ol className="lg:col-span-8">
        {services.map((service, i) => {
          const Icon = getIcon(service.icon);
          return (
            <li
              key={service.id}
              id={service.id}
              className="scroll-mt-[calc(var(--navbar-height)+2rem)] border-b border-border py-12 first:pt-0 last:border-b-0 last:pb-0"
            >
              <AnimatedReveal x={40} y={0} className="grid gap-6 sm:grid-cols-[auto_1fr]">
                <div className="flex items-center gap-4 sm:flex-col sm:items-center">
                  <span className="font-heading text-5xl leading-none font-semibold text-accent-ink/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-sm">
                    <Icon className="size-7" aria-hidden="true" />
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl font-semibold sm:text-4xl">{service.title}</h2>
                  <p className="mt-3 text-lg leading-relaxed text-heading">
                    {service.shortDescription}
                  </p>

                  <div className="mt-6 grid gap-6 xl:grid-cols-5">
                    <div className="xl:col-span-3">
                      <RichText text={service.longDescription} className="text-muted-foreground" />
                      {service.highlights && service.highlights.length > 0 && (
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {service.highlights.map((h) => (
                            <li
                              key={h}
                              className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-sm text-foreground"
                            >
                              <Check className="size-3.5 text-accent-ink" aria-hidden="true" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link
                        href={`/about/?service=${encodeURIComponent(service.id)}#contact`}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-ink hover:underline"
                      >
                        Enquire about {service.title.toLowerCase()}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                    {service.image && (
                      <div className="group relative aspect-16/10 overflow-hidden rounded-card shadow-card xl:col-span-2 xl:aspect-4/5">
                        <SmartImage
                          image={service.image}
                          fallbackAlt={service.title}
                          fill
                          sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 60vw, 100vw"
                          className={`object-cover ${imageZoom}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedReveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
