import type { Metadata } from "next";
import { getContact, getSite, hasText } from "@/lib/content";
import type { ContentImage } from "@/types/content";

/**
 * Per-page metadata: title, description, canonical URL, Open Graph and Twitter card.
 * Values come from content/site.json; `path` must match the route (with trailing slash).
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  /** Page title — omit on the home page to use site.seo.title. */
  title?: string;
  description?: string;
  /** Route path, e.g. "/projects/". */
  path: string;
  /** Page-specific share image (defaults to site.ogImage). */
  image?: ContentImage;
}): Metadata {
  const site = getSite();
  const desc = hasText(description) ? description : site.seo.description;
  const fullTitle = title ? site.seo.titleTemplate.replace("%s", title) : site.seo.title;
  // SVG previews aren't supported by social networks, so only use raster page images.
  const pageImage = image && /\.(jpe?g|png|webp)$/i.test(image.src) ? image : undefined;
  const ogImage = pageImage
    ? { url: pageImage.src, alt: pageImage.alt }
    : site.ogImage
      ? { url: site.ogImage, width: 1200, height: 630, alt: site.legalName }
      : undefined;

  return {
    ...(title ? { title } : {}),
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_LK",
      siteName: site.legalName,
      url: path,
      title: fullTitle,
      description: desc,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      ...(ogImage ? { images: [ogImage.url] } : {}),
    },
  };
}

/** schema.org structured data for the business (helps Google show address, phone, hours). */
export function businessJsonLd() {
  const site = getSite();
  const contact = getContact();
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalName,
    alternateName: site.name,
    slogan: site.tagline,
    description: site.seo.description,
    url: site.url,
    logo: `${site.url}${site.logo.stacked.light}`,
    ...(site.ogImage ? { image: `${site.url}${site.ogImage}` } : {}),
    telephone: [contact.phone, ...(contact.additionalPhones ?? [])],
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.join(", "),
      addressCountry: "LK",
    },
    areaServed: { "@type": "Country", name: "Sri Lanka" },
    sameAs: (contact.social ?? []).map((s) => s.url),
  };
}
