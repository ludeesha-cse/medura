import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import {
  ContactSection,
  MissionVision,
  Story,
  Team,
  Values,
} from "@/components/sections/AboutSections";
import { PageHeader } from "@/components/sections/PageHeader";
import { getAbout, getArchitecture, getContact, getEngineering } from "@/lib/content";

const about = getAbout();

export const metadata: Metadata = pageMetadata({
  title: "About & Contact",
  description: about.intro.subheading,
  path: "/about/",
});

export default function AboutPage() {
  const contact = getContact();
  const services = [
    ...getArchitecture().services.map((s) => ({ id: s.id, title: s.title, group: "Architecture" })),
    ...getEngineering().services.map((s) => ({
      id: s.id,
      title: s.title,
      group: "Engineering & other services",
    })),
  ];
  return (
    <>
      <PageHeader intro={about.intro} image={about.story.image} />
      <Story story={about.story} />
      <MissionVision mission={about.mission} vision={about.vision} />
      <Values values={about.values} intro={about.valuesIntro} />
      <Team team={about.team} />
      <ContactSection contact={contact} services={services} />
    </>
  );
}
