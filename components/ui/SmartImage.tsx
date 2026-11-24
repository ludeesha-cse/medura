"use client";

import Image from "next/image";
import { useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/content";
import type { ContentImage } from "@/types/content";

interface SmartImageProps {
  /** Image from site.json — may be missing (optional field). */
  image?: ContentImage;
  /** Alt text used when the image (or its alt) is missing. */
  fallbackAlt: string;
  /** Fills the nearest positioned parent (give the parent a fixed aspect ratio). */
  fill?: boolean;
  width?: number;
  height?: number;
  /** Above-the-fold image (page header): load eagerly with high priority. Others lazy-load. */
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Image wrapper used for all content images:
 * - shows /images/placeholder.svg when the image is missing in the JSON or fails to load
 * - lazy-loads by default (`priority` for hero images)
 * - use inside a box with a fixed aspect ratio to avoid layout shift
 */
export function SmartImage({
  image,
  fallbackAlt,
  fill = false,
  width = 1200,
  height = 900,
  priority = false,
  sizes = "100vw",
  className = "",
}: SmartImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const requested = image?.src?.trim() ? image.src : PLACEHOLDER_IMAGE;
  const src = failedSrc === requested ? PLACEHOLDER_IMAGE : requested;
  const alt = image?.alt?.trim() || fallbackAlt;

  return (
    <Image
      src={src}
      alt={alt}
      {...(fill ? { fill: true } : { width, height })}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      sizes={sizes}
      className={className}
      onError={() => setFailedSrc(requested)}
    />
  );
}
