import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

// Generated at build time → out/robots.txt
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const { url } = getSite();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
