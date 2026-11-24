import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import type { SectionIntro } from "@/types/content";

/** Eyebrow + heading + optional subheading, used at the top of sections. */
export function SectionHeading({
  intro,
  id,
  align = "left",
  onDark = false,
  as: Heading = "h2",
  className = "",
}: {
  intro: SectionIntro;
  /** id for the heading (use with <Section labelledBy>). */
  id?: string;
  align?: "left" | "center";
  onDark?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <AnimatedReveal
      as="header"
      className={`max-w-2xl ${centered ? "mx-auto text-center" : ""} ${className}`}
    >
      {intro.eyebrow && (
        <p
          className={`text-xs font-medium tracking-eyebrow uppercase ${onDark ? "text-inverse-accent" : "text-accent-ink"}`}
        >
          {intro.eyebrow}
        </p>
      )}
      <Heading
        id={id}
        className={`mt-3 text-4xl leading-tight font-semibold sm:text-5xl ${onDark ? "text-inverse-foreground" : "text-heading"}`}
      >
        {intro.heading}
      </Heading>
      <span
        className={`mt-5 block h-px w-16 bg-linear-to-r from-accent to-transparent ${centered ? "mx-auto" : ""}`}
        aria-hidden="true"
      />
      {intro.subheading && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${onDark ? "text-inverse-muted" : "text-muted-foreground"}`}
        >
          {intro.subheading}
        </p>
      )}
    </AnimatedReveal>
  );
}
