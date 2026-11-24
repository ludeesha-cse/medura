import Image from "next/image";
import { getSite } from "@/lib/content";

type LogoVariant = "horizontal" | "full" | "mark";

/** Intrinsic aspect ratios of the SVGs in public/images/brand (width / height). */
const SIZES: Record<LogoVariant, { width: number; height: number }> = {
  horizontal: { width: 5123, height: 1165 },
  full: { width: 1782, height: 1585 },
  mark: { width: 1421, height: 1185 },
};

/** Logo files come from site.logo in content/site.json. */
const files = (variant: LogoVariant) => {
  const { logo } = getSite();
  return variant === "full" ? logo.stacked : logo[variant];
};

interface LogoProps {
  variant?: LogoVariant;
  /**
   * "auto": follows the site theme (both files are rendered, CSS shows the right one — no flash).
   * "on-dark": always the light-colored artwork, for always-dark bands (hero, footer).
   * "on-light": always the original-colored artwork.
   */
  tone?: "auto" | "on-dark" | "on-light";
  alt?: string;
  className?: string;
  priority?: boolean;
}

export function Logo({
  variant = "horizontal",
  tone = "auto",
  alt,
  className = "h-10 w-auto",
  priority = false,
}: LogoProps) {
  const { width, height } = SIZES[variant];
  const { light, dark } = files(variant);
  const label = alt ?? getSite().legalName;
  // Lazy by default: the visible logo is on screen so it loads at once, while the hidden
  // light/dark twin (display:none) is never downloaded. `priority` makes it eager.
  const common = {
    width,
    height,
    className,
    loading: priority ? ("eager" as const) : ("lazy" as const),
  };

  if (tone === "on-dark") return <Image src={dark} alt={label} {...common} />;
  if (tone === "on-light") return <Image src={light} alt={label} {...common} />;

  return (
    <>
      <Image src={light} alt={label} {...common} className={`${className} dark:hidden`} />
      <Image src={dark} alt={label} {...common} className={`${className} hidden dark:block`} />
    </>
  );
}
