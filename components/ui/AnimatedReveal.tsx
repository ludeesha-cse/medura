"use client";

import { motion, type Variants } from "motion/react";

type Tag = "div" | "section" | "ul" | "ol" | "li" | "article" | "header" | "figure" | "p";

const EASE = [0.16, 1, 0.3, 1] as const;

const itemVariants = (y: number, x: number): Variants => ({
  hidden: { opacity: 0, y, x },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: EASE } },
});

interface AnimatedRevealProps {
  children: React.ReactNode;
  as?: Tag;
  className?: string;
  id?: string;
  /** Seconds to wait before animating. */
  delay?: number;
  /** Start offset in px (positive = slides up into place). */
  y?: number;
  /** Horizontal start offset in px (e.g. -40 slides in from the left). */
  x?: number;
  /**
   * Stagger mode: this element doesn't animate itself; its <RevealItem> children
   * animate one after another (seconds between items).
   */
  stagger?: number;
  /** Portion of the element that must be visible before it animates (0–1). */
  amount?: number;
}

/**
 * The ONE reusable scroll-reveal animation. Fades/slides content in the first time it
 * scrolls into view. With `stagger`, wrap each child in <RevealItem> for staggered cards.
 * Large movements are removed automatically for prefers-reduced-motion (see Providers).
 */
export function AnimatedReveal({
  children,
  as = "div",
  className,
  id,
  delay = 0,
  y = 28,
  x = 0,
  stagger,
  amount = 0.2,
}: AnimatedRevealProps) {
  const Component = motion[as];
  const variants: Variants =
    stagger !== undefined
      ? { hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }
      : {
          hidden: { opacity: 0, y, x },
          visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: EASE, delay } },
        };

  return (
    <Component
      id={id}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </Component>
  );
}

/** A child of <AnimatedReveal stagger={…}> — animates in its turn. */
export function RevealItem({
  children,
  as = "div",
  className,
  y = 28,
  x = 0,
}: {
  children: React.ReactNode;
  as?: Tag;
  className?: string;
  y?: number;
  x?: number;
}) {
  const Component = motion[as];
  return (
    <Component className={className} variants={itemVariants(y, x)}>
      {children}
    </Component>
  );
}
