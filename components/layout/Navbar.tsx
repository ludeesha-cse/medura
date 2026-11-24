"use client";

import { Mail, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { buttonClasses } from "@/components/ui/Button";
import type { Link as NavLink } from "@/types/content";

interface NavbarProps {
  items: NavLink[];
  cta?: NavLink;
  /** Theme-aware logo (rendered on the server and passed in). */
  logo: React.ReactNode;
  /** Light-colored logo, shown while the navbar is transparent over a dark page header. */
  logoOnDark: React.ReactNode;
  phone?: { label: string; href: string };
  email?: { label: string; href: string };
}

const SCROLL_THRESHOLD = 8;
const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};
const useScrolled = () =>
  useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > SCROLL_THRESHOLD,
    () => false,
  );

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);
const isActive = (pathname: string, href: string) => {
  const target = normalize(href.split("#")[0] || "/");
  const current = normalize(pathname);
  return target === "/" ? current === "/" : current === target || current.startsWith(`${target}/`);
};

/**
 * Sticky (fixed) navbar.
 * - Transparent over the dark page header at the top of every page; solid + blur + shadow
 *   once the page scrolls.
 * - Active link is highlighted (animated underline).
 * - Below `lg`: hamburger → slide-in drawer (focus-trapped, Esc / overlay closes it).
 */
export function Navbar({ items, cta, logo, logoOnDark, phone, email }: NavbarProps) {
  const pathname = usePathname() ?? "/";
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const onDark = !scrolled && !open;
  const drawerId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // While the drawer is open: lock page scroll, close on Esc, keep Tab focus inside.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-(--duration-base) ${
          onDark
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border bg-background/85 shadow-nav backdrop-blur-md"
        }`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-(--navbar-height) max-w-site items-center justify-between gap-4 px-(--gutter)"
        >
          <Link href="/" aria-label="Medura — home" className="shrink-0 rounded-md">
            <span className={onDark ? "block" : "hidden"}>{logoOnDark}</span>
            <span className={onDark ? "hidden" : "block"}>{logo}</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded-md px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-(--duration-fast) xl:px-4 ${
                      onDark
                        ? active
                          ? "text-inverse-accent"
                          : "text-inverse-foreground/85 hover:text-inverse-foreground"
                        : active
                          ? "text-accent-ink"
                          : "text-foreground hover:text-accent-ink"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-current xl:inset-x-4"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle onDark={onDark} />
            {cta && (
              <Link
                href={cta.href}
                className={`${buttonClasses("accent", "sm")} hidden sm:inline-flex`}
              >
                {cta.label}
              </Link>
            )}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls={drawerId}
              className={`inline-flex size-10 items-center justify-center rounded-button transition-colors lg:hidden ${
                onDark
                  ? "text-inverse-foreground hover:bg-white/10"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer — outside <header> so the header's backdrop-blur can't clip it */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-50 bg-ocean-950/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
              aria-hidden="true"
            />
            <motion.div
              key="panel"
              id={drawerId}
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col overflow-y-auto bg-background shadow-card-hover lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex h-(--navbar-height) items-center justify-between border-b border-border px-6">
                <span className="text-xs font-medium tracking-eyebrow text-accent-ink uppercase">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="inline-flex size-10 items-center justify-center rounded-button text-foreground hover:bg-secondary"
                >
                  <X className="size-6" aria-hidden="true" />
                </button>
              </div>

              <ul className="flex flex-col px-6 py-4">
                {items.map((item, i) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between border-b border-border py-3.5 font-heading text-2xl font-semibold ${
                          active ? "text-accent-ink" : "text-heading hover:text-accent-ink"
                        }`}
                      >
                        {item.label}
                        {active && (
                          <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-auto space-y-5 border-t border-border px-6 py-6">
                {cta && (
                  <Link
                    href={cta.href}
                    onClick={() => setOpen(false)}
                    className={`${buttonClasses("accent", "lg")} w-full`}
                  >
                    {cta.label}
                  </Link>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                {(phone || email) && (
                  <ul className="space-y-2 text-sm">
                    {phone && (
                      <li>
                        <a
                          href={phone.href}
                          className="inline-flex items-center gap-2 hover:text-accent-ink"
                        >
                          <Phone className="size-4 text-accent-ink" aria-hidden="true" />
                          {phone.label}
                        </a>
                      </li>
                    )}
                    {email && (
                      <li>
                        <a
                          href={email.href}
                          className="inline-flex items-center gap-2 hover:text-accent-ink"
                        >
                          <Mail className="size-4 text-accent-ink" aria-hidden="true" />
                          {email.label}
                        </a>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
