/**
 * Types for content/site.json — the single source of all site content.
 * Fields marked `?` are optional: pages hide that part (or show a placeholder image)
 * when they are missing or empty.
 */
import type { IconName } from "@/lib/icons";

/** An image in public/images. `src` is the URL path, e.g. "/images/projects/kandy-1.webp". */
export interface ContentImage {
  src: string;
  alt: string;
}

export interface Link {
  label: string;
  href: string;
}

export interface CallToAction extends Link {
  /** Visual style of the button. Defaults to "primary". */
  variant?: "primary" | "accent" | "outline";
}

/** Intro block shown at the top of a page or section. */
export interface SectionIntro {
  eyebrow?: string;
  heading: string;
  subheading?: string;
}

export interface LogoSet {
  /** Artwork for light backgrounds. */
  light: string;
  /** Artwork for dark backgrounds. */
  dark: string;
}

/* ---------------------------------------------------------------- site */

export interface SiteInfo {
  name: string;
  /** Full business name, e.g. "Medura Design & Engineering Consultants". */
  legalName: string;
  tagline: string;
  /** Production URL without trailing slash — used for sitemap, canonical & Open Graph. */
  url: string;
  logo: {
    /** Mark + wordmark side by side (navbar). */
    horizontal: LogoSet;
    /** Full stacked logo with tagline (footer, about). */
    stacked: LogoSet;
    /** Building mark only. */
    mark: LogoSet;
  };
  favicon: string;
  appleTouchIcon?: string;
  /** Image shown when a page is shared on social media — PNG/JPG, 1200×630. */
  ogImage?: string;
  seo: {
    /** Title of the home page. */
    title: string;
    /** Other pages: "%s" is replaced with the page title. */
    titleTemplate: string;
    description: string;
    keywords?: string[];
  };
  /** Links in the navbar and footer, in order. */
  navigation: Link[];
  /** The navbar's call-to-action button. */
  navCta?: Link;
}

/* ---------------------------------------------------------------- home */

export interface Stat {
  /** Number the counter animates to. */
  value: number;
  /** Shown after the number, e.g. "+" or "%". */
  suffix?: string;
  label: string;
}

export interface FeaturePoint {
  title: string;
  description: string;
  icon?: IconName;
}

export interface ServicePreviewCard {
  title: string;
  description: string;
  href: string;
  image?: ContentImage;
  icon?: IconName;
}

export interface HomeContent {
  hero: {
    eyebrow?: string;
    heading: string;
    subheading?: string;
    /** First image is the main background; extra images cross-fade as a slideshow. */
    images: ContentImage[];
    ctas?: CallToAction[];
  };
  stats?: Stat[];
  servicesPreview?: SectionIntro & { cards: ServicePreviewCard[] };
  featuredProjects?: SectionIntro & {
    /** `id`s from projects.items, in display order. */
    projectIds: string[];
    cta?: Link;
  };
  whyChooseUs?: SectionIntro & { points: FeaturePoint[]; image?: ContentImage };
  ctaBanner?: {
    heading: string;
    text?: string;
    ctas?: CallToAction[];
    image?: ContentImage;
  };
}

/* ------------------------------------------------------------ services */

export interface Service {
  /** Unique, URL-safe id (lowercase-with-dashes). */
  id: string;
  title: string;
  shortDescription: string;
  /** Shown when the card is expanded. Blank lines (\n\n) start a new paragraph. */
  longDescription?: string;
  icon?: IconName;
  image?: ContentImage;
  /** Optional bullet list of what's included. */
  highlights?: string[];
}

export interface ServicesPage {
  intro: SectionIntro;
  services: Service[];
  /** Optional help box (Engineering page side panel). */
  helpBox?: {
    heading: string;
    text?: string;
    cta?: Link;
  };
}

/* ------------------------------------------------------------ projects */

export interface Project {
  /** Unique, URL-safe id (lowercase-with-dashes). */
  id: string;
  title: string;
  /** Used by the filter on the Projects page. */
  category: string;
  location: string;
  year: number;
  client?: string;
  summary: string;
  /** Blank lines (\n\n) start a new paragraph. */
  description?: string;
  /** Carousel images — the first one is also the thumbnail. */
  images: ContentImage[];
  tags?: string[];
}

export interface ProjectsPage {
  intro: SectionIntro;
  /** Label of the "show everything" filter button. */
  allLabel?: string;
  items: Project[];
}

/* --------------------------------------------------------------- about */

export interface TeamMember {
  name: string;
  role: string;
  photo?: ContentImage;
  bio?: string;
}

export interface AboutContent {
  intro: SectionIntro;
  story: {
    eyebrow?: string;
    heading: string;
    /** One string per paragraph. */
    paragraphs: string[];
    image?: ContentImage;
  };
  mission?: string;
  vision?: string;
  valuesIntro?: SectionIntro;
  values?: FeaturePoint[];
  team?: SectionIntro & { members: TeamMember[] };
}

/* ------------------------------------------------------------- contact */

export type SocialPlatform =
  "facebook" | "instagram" | "linkedin" | "youtube" | "tiktok" | "x" | "pinterest" | "behance";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface ContactContent {
  intro: SectionIntro;
  /** As displayed, e.g. "+94 77 123 4567". */
  phone: string;
  email: string;
  /** International format, digits only, no "+" — e.g. "94771234567". */
  whatsapp: string;
  address: string[];
  /** Google Maps → Share → Embed a map → copy the src="..." URL. */
  mapEmbedUrl?: string;
  workingHours?: { days: string; hours: string }[];
  social?: SocialLink[];
  form: {
    heading: string;
    text?: string;
    /** First line of the pre-filled WhatsApp / email message. */
    messageGreeting: string;
    emailSubject: string;
  };
}

/* ---------------------------------------------------------------- root */

export interface SiteContent {
  site: SiteInfo;
  home: HomeContent;
  architecture: ServicesPage;
  engineering: ServicesPage;
  projects: ProjectsPage;
  about: AboutContent;
  contact: ContactContent;
}
