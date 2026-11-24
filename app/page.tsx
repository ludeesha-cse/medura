import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import {
  CtaBanner,
  FeaturedProjects,
  ServicesPreview,
  Stats,
  WhyChooseUs,
} from "@/components/sections/HomeSections";
import { getFeaturedProjects, getHome } from "@/lib/content";
import { businessJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ path: "/" });

export default function HomePage() {
  const home = getHome();
  return (
    <>
      <script
        type="application/ld+json"
        // Structured data for search engines (business name, address, phone…)
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <Hero hero={home.hero} />
      <Stats stats={home.stats} />
      <ServicesPreview data={home.servicesPreview} />
      <FeaturedProjects data={home.featuredProjects} projects={getFeaturedProjects()} />
      <WhyChooseUs data={home.whyChooseUs} />
      <CtaBanner data={home.ctaBanner} />
    </>
  );
}
