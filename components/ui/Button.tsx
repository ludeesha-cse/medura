import Link from "next/link";

export type ButtonVariant = "primary" | "accent" | "outline" | "outline-on-dark" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
  outline: "border border-border-strong text-foreground hover:bg-secondary",
  "outline-on-dark":
    "border border-inverse-foreground/60 text-inverse-foreground hover:bg-inverse-foreground hover:text-inverse",
  ghost: "text-foreground hover:bg-secondary",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

/** Shared button styles — also usable on plain <a> / <button> elements. */
export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return [
    "inline-flex items-center justify-center gap-2 rounded-button font-medium tracking-wide whitespace-nowrap",
    "transition-[background-color,color,border-color,transform,box-shadow] duration-(--duration-fast) ease-out-expo",
    "hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
  ].join(" ");
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">;

/** Internal links use next/link; external (http, tel:, mailto:) use a plain <a>. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = `${buttonClasses(variant, size)} ${className}`;
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);
  if (isExternal) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
