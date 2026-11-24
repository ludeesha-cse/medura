import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ArchitectureGrid } from "@/components/sections/ArchitectureGrid";
import { CtaBanner } from "@/components/sections/HomeSections";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { getArchitecture, getHome, hasItems } from "@/lib/content";

const page = getArchitecture();

export const metadata: Metadata = pageMetadata({
  title: "Architecture",
  description: page.intro.subheading,
  path: "/architecture/",
});

export default function ArchitecturePage() {
  return (
    <>
      <PageHeader intro={page.intro} image={page.services[0]?.image} />
      {hasItems(page.services) && (
        <Section>
          <h2 className="sr-only">Our architectural services</h2>
          <ArchitectureGrid services={page.services} />
        </Section>
      )}
      <CtaBanner data={getHome().ctaBanner} />
    </>
  );
}
