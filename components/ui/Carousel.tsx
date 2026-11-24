"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { ContentImage } from "@/types/content";

/** Reads `--duration-carousel` (ms) from styles/theme.css. */
function carouselDelay() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--duration-carousel")
    .trim();
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? (value.endsWith("ms") ? n : n * 1000) : 5000;
}

function createPlugins() {
  if (typeof window === "undefined") return [];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return []; // no autoplay
  return [
    Autoplay({
      delay: carouselDelay(),
      stopOnMouseEnter: true, // pause on hover…
      stopOnInteraction: false, // …and resume after a swipe / arrow click
      stopOnFocusIn: true, // pause while a keyboard user is inside
    }),
  ];
}

interface CarouselProps {
  images: ContentImage[];
  /** Accessible name, e.g. the project title. */
  label: string;
  /** Tailwind aspect-ratio class for the fixed frame. */
  aspectClassName?: string;
  sizes?: string;
  className?: string;
}

/**
 * Image carousel: autoplay (paused on hover/touch/focus, off for reduced motion), loop,
 * arrows, dots, swipe, ←/→ keys, lazy-loaded slides, fixed aspect ratio.
 */
export function Carousel({
  images,
  label,
  aspectClassName = "aspect-4/3",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className = "",
}: CarouselProps) {
  const multiple = images.length > 1;
  const [plugins] = useState(createPlugins);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: multiple, active: multiple },
    multiple ? plugins : [],
  );
  const [selected, setSelected] = useState(0);
  // Slides whose image may load: the first one + whatever has been near the viewport.
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1]));

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onInView = () => {
      const count = emblaApi.slideNodes().length;
      setLoaded((prev) => {
        const next = new Set(prev);
        for (const i of emblaApi.slidesInView()) {
          next.add(i);
          next.add((i + 1) % count); // preload the next slide
          next.add((i - 1 + count) % count);
        }
        return next.size === prev.size ? prev : next;
      });
    };
    emblaApi.on("select", onSelect).on("reInit", onSelect).on("slidesInView", onInView);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect).off("slidesInView", onInView);
    };
  }, [emblaApi]);

  const restartAutoplay = useCallback(() => {
    emblaApi?.plugins()?.autoplay?.reset();
  }, [emblaApi]);

  const go = useCallback(
    (dir: "prev" | "next" | number) => {
      if (!emblaApi) return;
      if (dir === "prev") emblaApi.scrollPrev();
      else if (dir === "next") emblaApi.scrollNext();
      else emblaApi.scrollTo(dir);
      restartAutoplay();
    },
    [emblaApi, restartAutoplay],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go("prev");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go("next");
    }
  };

  const arrow =
    "absolute top-1/2 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-heading shadow-card backdrop-blur transition-[background-color,opacity] duration-(--duration-fast) hover:bg-surface focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${label} — photos`}
      onKeyDown={multiple ? onKeyDown : undefined}
      className={`group relative overflow-hidden bg-surface-muted ${aspectClassName} ${className}`}
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full touch-pan-y">
          {images.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${images.length}`}
              className="relative h-full min-w-0 shrink-0 grow-0 basis-full"
            >
              {loaded.has(i) && (
                <Image
                  src={img.src}
                  alt={img.alt || `${label} — photo ${i + 1}`}
                  fill
                  sizes={sizes}
                  loading="lazy"
                  draggable={false}
                  className="animate-fade-in object-cover transition-transform duration-(--duration-slow) ease-out-expo select-none group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {multiple && (
        <>
          <button
            type="button"
            onClick={() => go("prev")}
            aria-label="Previous photo"
            className={`${arrow} left-3`}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go("next")}
            aria-label="Next photo"
            className={`${arrow} right-3`}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>

          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-current={i === selected ? "true" : undefined}
                className="group/dot flex h-6 items-center px-0.5"
              >
                <span
                  className={`block h-1.5 rounded-full shadow-sm transition-all duration-(--duration-base) ${
                    i === selected ? "w-6 bg-accent" : "w-1.5 bg-white/80 group-hover/dot:bg-white"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
