import { AnimatedReveal, RevealItem } from "@/components/ui/AnimatedReveal";
import { cardHover, cardSurface, imageZoom } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { hasItems } from "@/lib/content";
import { getIcon } from "@/lib/icons";
import type { ProjectsPage } from "@/types/content";

/** "Project sectors & capabilities" — the types of buildings Medura works on. */
export function ProjectSectors({ sectors }: { sectors: ProjectsPage["sectors"] }) {
  if (!sectors || !hasItems(sectors.items)) return null;
  return (
    <div className="mb-16 lg:mb-24">
      <SectionHeading intro={sectors} id="sectors-heading" align="center" />
      <AnimatedReveal
        as="ul"
        stagger={0.12}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {sectors.items.map((sector) => {
          const Icon = getIcon(sector.icon);
          return (
            <RevealItem
              as="li"
              key={sector.title}
              className={`group overflow-hidden ${cardSurface} ${cardHover}`}
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <SmartImage
                  image={sector.image}
                  fallbackAlt={sector.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={`object-cover ${imageZoom}`}
                />
              </div>
              <div className="flex gap-4 p-6">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-2xl font-semibold">{sector.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {sector.description}
                  </p>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </AnimatedReveal>
    </div>
  );
}
