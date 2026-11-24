"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useRef, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/** true only after hydration — the theme is unknown on the server. */
const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

/** Reads a duration token like `--duration-slow: 600ms` from styles/theme.css. */
function readDuration(token: string, fallback: number) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const ms = parseFloat(value);
  return Number.isFinite(ms)
    ? value.endsWith("s") && !value.endsWith("ms")
      ? ms * 1000
      : ms
    : fallback;
}

/** Puts the theme class on <html> immediately (next-themes applies it in an effect). */
function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeToggle({
  className = "",
  onDark = false,
}: {
  className?: string;
  /** Use on the transparent navbar over a dark hero. */
  onDark?: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = mounted && resolvedTheme === "dark";
  const next: Theme = isDark ? "light" : "dark";

  const switchTheme = () => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const commit = () => {
      applyThemeClass(next);
      setTheme(next);
    };

    if (reduceMotion) return commit();

    // Fallback (no View Transitions API): short color crossfade.
    if (!document.startViewTransition) {
      root.classList.add("theme-fade");
      commit();
      window.setTimeout(
        () => root.classList.remove("theme-fade"),
        readDuration("--duration-base", 300),
      );
      return;
    }

    // Circular reveal from the centre of the toggle button.
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(commit);
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: readDuration("--duration-slow", 600),
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
  };

  const label = mounted ? `Switch to ${next} mode` : "Toggle color theme";

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={switchTheme}
      aria-label={label}
      title={label}
      className={`relative inline-flex size-10 items-center justify-center rounded-button transition-colors duration-(--duration-fast) ${onDark ? "text-inverse-foreground hover:bg-white/10" : "text-foreground hover:bg-secondary"} ${className}`}
    >
      {mounted ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex"
            aria-hidden="true"
          >
            {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}
