import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CtaBanner } from "@/components/sections/HomeSections";
import { Packages } from "@/components/sections/Packages";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServicesList } from "@/components/sections/ServicesList";
import { Section } from "@/components/ui/Section";
import { getContact, getEngineering, getHome, hasItems, telHref } from "@/lib/content";

const page = getEngineering();

export const metadata: Metadata = pageMetadata({
  title: "Engineering & Other Services",
  description: page.intro.subheading,
  path: "/services/",
});

export default function ServicesPage() {
  const contact = getContact();
  return (
    <>
      <PageHeader intro={page.intro} image={page.services[0]?.image} />
      {hasItems(page.services) && (
        <Section>
          <ServicesList
            services={page.services}
            helpBox={page.helpBox}
            phone={{ label: contact.phone, href: telHref(contact.phone) }}
          />
        </Section>
      )}
      <Packages data={page.packages} />
      <CtaBanner data={getHome().ctaBanner} />
    </>
  );
}
