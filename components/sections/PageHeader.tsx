import { SmartImage } from "@/components/ui/SmartImage";
import type { ContentImage, SectionIntro } from "@/types/content";

/**
 * Dark band at the top of inner pages. Every page starts with a dark band (this, or the
 * home hero) so the transparent navbar always sits on a dark background.
 */
export function PageHeader({
  intro,
  image,
  children,
}: {
  intro: SectionIntro;
  image?: ContentImage;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-inverse text-inverse-foreground">
      {image && (
        <div className="absolute inset-0 -z-10">
          <SmartImage
            image={image}
            fallbackAlt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-overlay-from to-overlay-to" />
        </div>
      )}
      <div className="mx-auto max-w-site px-(--gutter) pt-[calc(var(--navbar-height)+3.5rem)] pb-14 sm:pb-20 lg:pt-[calc(var(--navbar-height)+5rem)]">
        {intro.eyebrow && (
          <p className="text-xs font-medium tracking-eyebrow text-inverse-accent uppercase">
            {intro.eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-inverse-foreground sm:text-5xl lg:text-6xl">
          {intro.heading}
        </h1>
        {intro.subheading && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-inverse-muted sm:text-lg">
            {intro.subheading}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
