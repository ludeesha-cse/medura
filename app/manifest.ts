import type { MetadataRoute } from "next";
import { BRAND_COLORS } from "@/lib/brand";
import { getSite } from "@/lib/content";

// Generated at build time → out/manifest.webmanifest (used for "Add to home screen").
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const site = getSite();
  return {
    name: site.legalName,
    short_name: site.name,
    description: site.seo.description,
    start_url: "/",
    display: "standalone",
    theme_color: BRAND_COLORS.primary,
    background_color: BRAND_COLORS.lightBackground,
    icons: [
      { src: site.favicon, sizes: "any", type: "image/svg+xml" },
      ...(site.appleTouchIcon
        ? [{ src: site.appleTouchIcon, sizes: "180x180", type: "image/png" }]
        : []),
    ],
  };
}
