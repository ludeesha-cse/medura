import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

// Generated at build time → out/sitemap.xml. Pages come from site.navigation in site.json.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { url, navigation } = getSite();
  const lastModified = new Date();
  return navigation.map((item) => ({
    url: `${url}${item.href}`,
    lastModified,
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));
}
