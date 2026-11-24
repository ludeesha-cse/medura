"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSyncExternalStore } from "react";
import { BrandIcon } from "@/components/ui/BrandIcon";

const SHOW_BACK_TO_TOP_AFTER = 600; // px scrolled

const subscribe = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

/** Floating WhatsApp button + back-to-top button (bottom-right corner). */
export function FloatingActions({ whatsappHref }: { whatsappHref: string }) {
  const showTop = useSyncExternalStore(
    subscribe,
    () => window.scrollY > SHOW_BACK_TO_TOP_AFTER,
    () => false,
  );

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Move keyboard focus back to the top of the page too.
    document.getElementById("skip-link")?.focus({ preventScroll: true });
  };

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-center gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            title="Back to top"
            initial={{ opacity: 0, y: 12, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-heading shadow-card transition-colors hover:bg-secondary"
          >
            <ArrowUp className="size-5" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        className="group relative inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-card-hover transition-[background-color,transform] duration-(--duration-fast) hover:scale-105 hover:bg-whatsapp-hover motion-reduce:hover:scale-100"
      >
        <span
          className="absolute inset-0 animate-ping rounded-full bg-whatsapp opacity-25 motion-reduce:hidden"
          aria-hidden="true"
        />
        <BrandIcon name="whatsapp" className="relative size-7" />
      </a>
    </div>
  );
}
