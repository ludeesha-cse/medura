"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonLink, type ButtonVariant } from "@/components/ui/Button";
import type { HomeContent } from "@/types/content";

const SLIDE_MS = 7000;

/** Full-screen hero: background image(s) with parallax + cross-fade, deep ocean blue overlay, animated headline. */
export function Hero({ hero }: { hero: HomeContent["hero"] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  const images = hero.images.filter((img) => img?.src);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (images.length < 2 || reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % images.length), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [images.length, reduce]);

  const words = hero.heading.split(" ");
  const variantFor = (v?: string): ButtonVariant =>
    v === "outline" ? "outline-on-dark" : v === "accent" ? "accent" : "primary";

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-svh items-end overflow-hidden bg-inverse text-inverse-foreground"
    >
      {/* Background: parallax + cross-fade between hero images */}
      <motion.div
        className="absolute inset-0 -z-10 scale-110"
        style={{ y: bgY }}
        aria-hidden="true"
      >
        <AnimatePresence initial={false}>
          {images[index] && (
            <motion.div
              key={images[index].src}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6 }}
            >
              <Image
                src={images[index].src}
                alt=""
                fill
                loading="eager"
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div
        className="absolute inset-0 -z-10 bg-linear-to-t from-overlay-from via-overlay-to to-overlay-to"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-r from-overlay-from/80 to-transparent"
        aria-hidden="true"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-site px-(--gutter) pt-[calc(var(--navbar-height)+4rem)] pb-24 sm:pb-28 lg:pb-32"
      >
        {hero.eyebrow && (
          <p className="animate-fade-in text-xs font-medium tracking-eyebrow text-inverse-accent uppercase motion-reduce:animate-none">
            {hero.eyebrow}
          </p>
        )}
        <h1
          id="hero-heading"
          className="mt-4 max-w-4xl text-5xl leading-[1.05] font-semibold text-inverse-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="inline-block overflow-hidden pb-[0.08em] align-bottom"
            >
              <span
                className="inline-block animate-rise motion-reduce:animate-none"
                style={{ animationDelay: `${150 + i * 70}ms` }}
              >
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </h1>
        {hero.subheading && (
          <p
            className="mt-6 max-w-2xl animate-rise text-base leading-relaxed text-inverse-muted motion-reduce:animate-none sm:text-lg"
            style={{ animationDelay: `${300 + words.length * 70}ms` }}
          >
            {hero.subheading}
          </p>
        )}
        {hero.ctas && hero.ctas.length > 0 && (
          <div
            className="mt-9 flex animate-rise flex-wrap gap-3 motion-reduce:animate-none"
            style={{ animationDelay: `${450 + words.length * 70}ms` }}
          >
            {hero.ctas.map((cta) => (
              <ButtonLink
                key={cta.href + cta.label}
                href={cta.href}
                variant={variantFor(cta.variant)}
                size="lg"
              >
                {cta.label}
              </ButtonLink>
            ))}
          </div>
        )}
      </motion.div>

      <a
        href="#home-content"
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-inverse-muted hover:text-inverse-foreground motion-reduce:animate-none sm:block"
      >
        <ChevronDown className="size-7" aria-hidden="true" />
      </a>
    </section>
  );
}
