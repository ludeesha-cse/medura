import { toParagraphs } from "@/lib/content";

/** Renders a long text field from site.json as paragraphs (split on blank lines). */
export function RichText({ text, className = "" }: { text?: string; className?: string }) {
  const paragraphs = toParagraphs(text);
  if (!paragraphs.length) return null;
  return (
    <div className={`space-y-4 leading-relaxed ${className}`}>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 32)}>{p}</p>
      ))}
    </div>
  );
}
