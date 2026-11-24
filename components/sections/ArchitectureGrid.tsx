"use client";

import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { RevealItem, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { RichText } from "@/components/ui/RichText";
import { SmartImage } from "@/components/ui/SmartImage";
import { getIcon } from "@/lib/icons";
import type { Service } from "@/types/content";
import { imageZoom } from "@/components/ui/Card";

/** Architecture services: responsive card grid; each card expands to show its long description. */
export function ArchitectureGrid({ services }: { services: Service[] }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <AnimatedReveal
      as="ul"
      stagger={0.08}
      className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
    >
      {services.map((service) => {
        const Icon = getIcon(service.icon);
        const isOpen = open.has(service.id);
        const panelId = `service-${service.id}-details`;
        const hasDetails = Boolean(service.longDescription || service.highlights?.length);

        return (
          <RevealItem as="li" key={service.id}>
            <article
              id={service.id}
              className={`group flex flex-col overflow-hidden rounded-card border bg-surface shadow-card transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-out-expo hover:shadow-card-hover ${
                isOpen
                  ? "border-accent"
                  : "border-border hover:-translate-y-1.5 motion-reduce:hover:translate-y-0"
              }`}
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <SmartImage
                  image={service.image}
                  fallbackAlt={service.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={`object-cover ${imageZoom}`}
                />
                <span className="absolute -bottom-6 left-6 inline-flex size-14 items-center justify-center rounded-full border-4 border-surface bg-accent text-accent-foreground shadow-card">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
              </div>

              <div className="flex flex-1 flex-col px-6 pt-10 pb-6">
                <h3 className="text-3xl font-semibold">{service.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {service.shortDescription}
                </p>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      key="details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 border-t border-border pt-5">
                        <RichText text={service.longDescription} className="text-foreground" />
                        {service.highlights && service.highlights.length > 0 && (
                          <ul className="mt-5 space-y-2">
                            {service.highlights.map((h) => (
                              <li key={h} className="flex items-start gap-2.5 text-sm">
                                <Check
                                  className="mt-0.5 size-4 shrink-0 text-accent-ink"
                                  aria-hidden="true"
                                />
                                {h}
                              </li>
                            ))}
                          </ul>
                        )}
                        <Link
                          href={`/about/?service=${encodeURIComponent(service.id)}#contact`}
                          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-ink hover:underline"
                        >
                          Discuss this service
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {hasDetails && (
                  <button
                    type="button"
                    onClick={() => toggle(service.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="mt-5 inline-flex items-center gap-2 self-start rounded-button text-sm font-medium tracking-wide text-heading hover:text-accent-ink"
                  >
                    {isOpen ? "Show less" : "Read more"}
                    <ChevronDown
                      className={`size-4 transition-transform duration-(--duration-base) ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                    <span className="sr-only">about {service.title}</span>
                  </button>
                )}
              </div>
            </article>
          </RevealItem>
        );
      })}
    </AnimatedReveal>
  );
}
