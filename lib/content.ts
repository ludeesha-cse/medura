/**
 * Typed access to content/site.json — the ONLY place that imports the JSON.
 * Components call these getters instead of reading the file directly.
 *
 * The getters also tidy the data so pages can render it safely:
 * empty strings / empty lists in optional fields are treated as "not provided",
 * so the matching section is simply hidden.
 */
import raw from "@/content/site.json";
import type { ContentImage, Project, Service, ServicesPage, SiteContent } from "@/types/content";

// The build-time validator (scripts/validate-content) checks the JSON matches these types.
const content = raw as unknown as SiteContent;

/** Shown wherever an optional image is missing. */
export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

/* ------------------------------------------------------------- helpers */

/** True when a string has visible text. */
export const hasText = (value?: string | null): value is string =>
  typeof value === "string" && value.trim().length > 0;

/** True when a list exists and has at least one item. */
export const hasItems = <T>(list?: T[] | null): list is T[] =>
  Array.isArray(list) && list.length > 0;

/** Splits a long text field into paragraphs on blank lines. */
export const toParagraphs = (text?: string): string[] =>
  hasText(text)
    ? text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

/** Returns the image, or the placeholder (with the given alt text) when it's missing. */
export function imageOrPlaceholder(image: ContentImage | undefined, alt: string): ContentImage {
  return image && hasText(image.src)
    ? { src: image.src, alt: image.alt || alt }
    : { src: PLACEHOLDER_IMAGE, alt };
}

/** Project images, or a single placeholder when the list is empty. */
export function projectImages(project: Project): ContentImage[] {
  const images = (project.images ?? []).filter((img) => hasText(img?.src));
  return images.length ? images : [{ src: PLACEHOLDER_IMAGE, alt: project.title }];
}

/* ------------------------------------------------------------- getters */

export const getSiteContent = (): SiteContent => content;
export const getSite = () => content.site;
export const getHome = () => content.home;
export const getAbout = () => content.about;
export const getContact = () => content.contact;

const cleanServices = (page: ServicesPage): ServicesPage => ({
  ...page,
  services: (page.services ?? []).filter((s) => hasText(s.id) && hasText(s.title)),
});

export const getArchitecture = () => cleanServices(content.architecture);
export const getEngineering = () => cleanServices(content.engineering);

/** Every service (architecture first), e.g. for the contact form's dropdown. */
export const getAllServices = (): Service[] => [
  ...getArchitecture().services,
  ...getEngineering().services,
];

export const getProjectsPage = () => content.projects;

/** Projects, newest first. */
export const getProjects = (): Project[] =>
  [...(content.projects.items ?? [])]
    .filter((p) => hasText(p.id) && hasText(p.title))
    .sort((a, b) => b.year - a.year);

/** Unique categories in order of first appearance (for the Projects filter). */
export const getProjectCategories = (): string[] => [
  ...new Set(
    getProjects()
      .map((p) => p.category)
      .filter(hasText),
  ),
];

/** Featured projects in the order listed in home.featuredProjects.projectIds (unknown ids skipped). */
export function getFeaturedProjects(): Project[] {
  const ids = content.home.featuredProjects?.projectIds ?? [];
  const byId = new Map(getProjects().map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is Project => Boolean(p));
}

/* --------------------------------------------------------------- links */

/** "+94 77 123 4567" → "tel:+94771234567" */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** WhatsApp click-to-chat link, optionally with a pre-filled message. */
export const whatsappHref = (number: string, message?: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}${hasText(message) ? `?text=${encodeURIComponent(message)}` : ""}`;

/** mailto: link with optional pre-filled subject and body. */
export function mailtoHref(email: string, subject?: string, body?: string) {
  const params = [
    hasText(subject) && `subject=${encodeURIComponent(subject)}`,
    hasText(body) && `body=${encodeURIComponent(body)}`,
  ].filter(Boolean);
  return `mailto:${email}${params.length ? `?${params.join("&")}` : ""}`;
}
