type Tone = "default" | "muted" | "inverse";

const TONES: Record<Tone, string> = {
  default: "bg-background text-foreground",
  muted: "bg-surface-muted text-foreground",
  inverse: "bg-inverse text-inverse-foreground",
};

/** Page section with the standard vertical rhythm, background tone and content width. */
export function Section({
  children,
  tone = "default",
  id,
  className = "",
  containerClassName = "",
  labelledBy,
}: {
  children: React.ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  containerClassName?: string;
  /** id of the heading that names this section (accessibility). */
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`py-(--section-padding-y) ${TONES[tone]} ${className}`}
    >
      <div className={`mx-auto max-w-site px-(--gutter) ${containerClassName}`}>{children}</div>
    </section>
  );
}
