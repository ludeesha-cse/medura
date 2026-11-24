/**
 * Shared card styles, so every card on the site looks and moves the same way.
 * Tweak hover behaviour here (timings come from the duration tokens in styles/theme.css).
 */

/** Card surface: background, border, rounded corners, shadow. */
export const cardSurface = "rounded-card border border-border bg-surface shadow-card";

/** Hover lift + stronger shadow (no movement for prefers-reduced-motion). */
export const cardHover =
  "transition-[transform,box-shadow,border-color] duration-(--duration-base) ease-out-expo hover:-translate-y-1.5 hover:shadow-card-hover motion-reduce:hover:translate-y-0";

/** Image zoom when the parent `group` is hovered — put on the <img>/<SmartImage>. */
export const imageZoom =
  "transition-transform duration-(--duration-slow) ease-out-expo group-hover:scale-105 motion-reduce:group-hover:scale-100";

/** Simple card wrapper for static content. */
export function Card({
  children,
  as: Tag = "div",
  interactive = false,
  className = "",
}: {
  children: React.ReactNode;
  as?: "div" | "article" | "li";
  interactive?: boolean;
  className?: string;
}) {
  return (
    <Tag className={`${cardSurface} ${interactive ? cardHover : ""} ${className}`}>{children}</Tag>
  );
}
