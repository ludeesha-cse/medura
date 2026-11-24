"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

// The very first page (server-rendered HTML) is shown immediately — no fade-in that would
// hide content until JavaScript loads. Later client-side navigations animate in.
let isFirstLoad = true;

/**
 * Fade + slight rise when a new page is shown. Used from app/template.tsx, which Next.js
 * re-mounts on every navigation. Reduced motion: MotionConfig drops the movement.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => !isFirstLoad);
  useEffect(() => {
    isFirstLoad = false;
  }, []);

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
