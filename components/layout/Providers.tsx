"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";

/**
 * App-wide client providers.
 * - next-themes: adds `light` / `dark` class on <html>, follows the OS setting by default,
 *   remembers the visitor's choice in localStorage ("medura-theme"), and injects a tiny
 *   blocking script in <head> so the correct theme is applied before first paint (no flash).
 * - MotionConfig reducedMotion="user": every motion animation respects prefers-reduced-motion.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="medura-theme"
      // Our ThemeToggle handles the transition (circular reveal), so no CSS transitions on switch.
      disableTransitionOnChange
      // Avoids React's "script tag rendered" dev warning: the script runs from the static HTML,
      // and is inert when React re-renders it on the client.
      scriptProps={{ type: typeof window === "undefined" ? "text/javascript" : "text/plain" }}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
