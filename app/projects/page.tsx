import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CtaBanner } from "@/components/sections/HomeSections";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectSectors } from "@/components/sections/ProjectSectors";
import { ProjectsExplorer } from "@/components/sections/ProjectsExplorer";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getHome,
  getProjectCategories,
  getProjects,
  getProjectsPage,
  projectImages,
} from "@/lib/content";

const page = getProjectsPage();

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: page.intro.subheading,
  path: "/projects/",
});

export default function ProjectsPage() {
  const projects = getProjects().map((p) => ({ ...p, displayImages: projectImages(p) }));
  return (
    <>
      <PageHeader intro={page.intro} image={projects[0]?.displayImages[0]} />
      {projects.length > 0 ? (
        <Section>
          <ProjectSectors sectors={page.sectors} />
          {page.sectors && page.listIntro && (
            <SectionHeading intro={page.listIntro} id="projects-list-heading" align="center" />
          )}
          <ProjectsExplorer
            projects={projects}
            categories={getProjectCategories()}
            allLabel={page.allLabel}
          />
        </Section>
      ) : (
        <Section>
          <ProjectSectors sectors={page.sectors} />
          <p className="text-center text-muted-foreground">Projects coming soon.</p>
        </Section>
      )}
      <CtaBanner data={getHome().ctaBanner} />
    </>
  );
}
