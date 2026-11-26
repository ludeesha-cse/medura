"use client";

import { Calendar, MapPin, UserRound } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Carousel } from "@/components/ui/Carousel";
import { RichText } from "@/components/ui/RichText";
import type { ContentImage, Project } from "@/types/content";

type ProjectWithImages = Project & { displayImages: ContentImage[] };

/**
 * Projects page body: category filter (client-side, animated re-ordering) and one large
 * card per project — carousel on one side, text on the other, alternating on desktop.
 */
export function ProjectsExplorer({
  projects,
  categories,
  allLabel = "All",
}: {
  projects: ProjectWithImages[];
  categories: string[];
  allLabel?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const visible = active ? projects.filter((p) => p.category === active) : projects;
  const filters: { label: string; value: string | null; count: number }[] = [
    { label: allLabel, value: null, count: projects.length },
    ...categories.map((c) => ({
      label: c,
      value: c,
      count: projects.filter((p) => p.category === c).length,
    })),
  ];

  return (
    <LayoutGroup>
      {categories.length > 1 && (
        <div
          role="group"
          aria-label="Filter projects by category"
          className="flex flex-wrap justify-center gap-2"
        >
          {filters.map((f) => {
            const selected = active === f.value;
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => setActive(f.value)}
                aria-pressed={selected}
                className={`relative inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium tracking-wide transition-colors duration-(--duration-fast) ${
                  selected
                    ? "text-primary-foreground"
                    : "border border-border bg-surface text-foreground hover:border-border-strong"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 -z-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{f.label}</span>
                <span
                  className={`relative text-xs ${selected ? "text-primary-foreground/75" : "text-muted-foreground"}`}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {active ? ` in ${active}` : ""}
      </p>

      <ul className="mt-12 space-y-10 lg:mt-16 lg:space-y-16">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => (
            <motion.li
              key={project.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatedReveal y={48} amount={0.15}>
                <ProjectCard project={project} reversed={i % 2 === 1} />
              </AnimatedReveal>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </LayoutGroup>
  );
}

function ProjectCard({ project, reversed }: { project: ProjectWithImages; reversed: boolean }) {
  return (
    <article
      id={project.id}
      aria-labelledby={`${project.id}-title`}
      className="grid scroll-mt-[calc(var(--navbar-height)+1.5rem)] overflow-hidden rounded-card border border-border bg-surface shadow-card transition-shadow duration-(--duration-base) hover:shadow-card-hover lg:grid-cols-2"
    >
      <Carousel
        images={project.displayImages}
        label={project.title}
        aspectClassName="aspect-4/3 lg:aspect-auto lg:min-h-[28rem]"
        className={reversed ? "lg:order-last" : ""}
      />

      <div className="flex flex-col p-6 sm:p-8 lg:p-10 xl:p-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium tracking-eyebrow text-foreground uppercase">
            {project.category}
          </span>
          {project.year && (
            <span className="font-heading text-lg text-muted-foreground">{project.year}</span>
          )}
        </div>

        <h2
          id={`${project.id}-title`}
          className="mt-4 text-3xl leading-tight font-semibold sm:text-4xl"
        >
          {project.title}
        </h2>

        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <dt>
              <MapPin className="size-4 text-accent-ink" aria-hidden="true" />
              <span className="sr-only">Location</span>
            </dt>
            <dd>{project.location}</dd>
          </div>
          {project.year && (
            <div className="flex items-center gap-1.5">
              <dt>
                <Calendar className="size-4 text-accent-ink" aria-hidden="true" />
                <span className="sr-only">Year</span>
              </dt>
              <dd>{project.year}</dd>
            </div>
          )}
          {project.client && (
            <div className="flex items-center gap-1.5">
              <dt>
                <UserRound className="size-4 text-accent-ink" aria-hidden="true" />
                <span className="sr-only">Client</span>
              </dt>
              <dd>{project.client}</dd>
            </div>
          )}
        </dl>

        <p className="mt-6 text-lg leading-relaxed text-heading">{project.summary}</p>
        <RichText text={project.description} className="mt-4 text-muted-foreground" />

        {project.tags && project.tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2 pt-8" aria-label="Tags">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
